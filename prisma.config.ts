import 'dotenv/config'; //load variables form .env into process.env
import { defineConfig, env } from "prisma/config"; //new prisma config helper for migrations

export default defineConfig({ 
    schema: "prisma/schema.prisma", //locate schemafile
    migrations: { 
        path: "prisma/migrations", //location for migration folder
    },
    datasource: { //migration connection info
        //url: env ("DATABASE_URL"), //Read DATABASE_URL from env file
        url: env ("DIRECT_URL"), //Read DATABASE_URL from env file
    },
});

