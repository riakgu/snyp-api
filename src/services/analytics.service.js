import { prismaClient } from '../config/database.js';

function getPeriodDates(period) {
    const now = new Date();
    const periods = {
        '24h': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90,
        'alltime': null,
    };
    const days = periods[period];

    if (days === null) {
        return {
            start: null,
            end: null,
            prevStart: null,
            prevEnd: null,
        };
    }

    return {
        start: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
        end: now,
        prevStart: new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000),
        prevEnd: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
    };
}

async function getOverview(req) {
    const { userId } = req.auth;
    const period = req.query.period || '7d';
    const { start, end, prevStart, prevEnd } = getPeriodDates(period);

    const baseWhere = {
        link: { user_id: userId, deleted_at: null }
    };

    const dateFilter = start ? { gte: start, lte: end } : undefined;
    const prevDateFilter = prevStart ? { gte: prevStart, lte: prevEnd } : undefined;

    // Current period
    const current = await prismaClient.linkClick.groupBy({
        by: ['is_unique', 'is_qr'],
        where: {
            ...baseWhere,
            ...(dateFilter && { created_at: dateFilter })
        },
        _count: true,
    });

    // Previous period
    const previous = await prismaClient.linkClick.groupBy({
        by: ['is_unique', 'is_qr'],
        where: {
            ...baseWhere,
            ...(prevDateFilter && { created_at: prevDateFilter })
        },
        _count: true,
    });

    const summarize = (data) => {
        let total = 0, unique = 0, qr = 0;
        data.forEach(row => {
            total += row._count;
            if (row.is_unique) unique += row._count;
            if (row.is_qr) qr += row._count;
        });
        return { total_clicks: total, unique_clicks: unique, qr_clicks: qr };
    };

    return {
        ...summarize(current),
        previous: summarize(previous),
    };
}

async function getClicks(req) {
    const { userId } = req.auth;
    const period = req.query.period || '7d';
    const { start, end } = getPeriodDates(period);

    const baseWhere = {
        link: { user_id: userId, deleted_at: null },
        ...(start && { created_at: { gte: start, lte: end } })
    };

    const clicks = await prismaClient.linkClick.groupBy({
        by: ['created_at'],
        where: baseWhere,
        _count: true,
        orderBy: { created_at: 'asc' },
    });

    // Group by date
    const grouped = {};
    clicks.forEach(row => {
        const date = row.created_at.toISOString().split('T')[0];
        grouped[date] = (grouped[date] || 0) + row._count;
    });

    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}

export default {
    getOverview,
    getClicks,
};