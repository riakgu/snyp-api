# Snyp API


## Overview
Snyp API is a fast and secure URL shortening service designed for modern applications.
It includes features such as link shortening, QR code generation, password-protected links, expiration, archiving, visit tracking, and rate limiting.

### Built With
[![Node.js][Node.js]][Node-url] [![Express][Express.js]][Express-url] [![Prisma][Prisma]][Prisma-url] [![PostgreSQL][PostgreSQL]][PostgreSQL-url] [![Redis][Redis]][Redis-url] [![JWT][JWT]][JWT-url]


## Documentation

Full API documentation is available in the **`docs/`** directory.

You can also explore and test the API using the Postman collection below:

[![Postman][Postman]][Postman-url]


## Getting Started

### Prerequisites
* Node.js >= v24.11.0
* PostgreSQL >= v18.0
* Redis >= v7.0.15

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/riakgu/snyp-api.git
   cd snyp-api
   ```

2. Install dependencies
   ```sh
   npm install
   ```

3. Set up environment variables
   ```sh
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # App
   NODE_ENV=development
   PORT=3000
   BASE_URL=http://localhost:3000

   # Database
   DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb"

   # Redis
   REDIS_URL="redis://username:authpassword@localhost:6379/0"

   # JWT
   JWT_ACCESS_SECRET=your-super-secret-access-key
   JWT_REFRESH_SECRET=your-super-secret-refresh-key
   JWT_ACCESS_EXPIRE="15m"
   JWT_REFRESH_EXPIRE="7d"
   ```

4. Set up database
   ```sh
   npx prisma generate
   npx prisma migrate dev
   ```

5. Start Redis server
   ```sh
   redis-server
   ```

6. Start the application
   ```sh
   npm run dev
   # The API will be available at `http://localhost:3000`
   ```


## Running Tests

Before running tests, switch your environment to **test mode** by updating your `.env` file:

```env
NODE_ENV=test
```

Then run the tests:

```sh
npm run test
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


[Postman]: https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white
[Postman-url]: https://documenter.getpostman.com/view/29055658/2sB3WvNJRm
[Node.js]: https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Redis]: https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[JWT]: https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[JWT-url]: https://jwt.io/