import { Elysia, t } from "elysia";
import "dotenv/config";
import { db } from "./drizzle/db";
import { usersTable } from "./drizzle/schema";
import { jwt } from '@elysiajs/jwt'
import { eq } from "drizzle-orm"


const app = new Elysia()
    .use(
      jwt({
        name: "jwt",
        secret: "secret"
      })
    )
    .derive(({ headers }) => {
      const auth = headers['authorization']

      return {
          token: auth ? auth.split(' ')[1] : null
      }
  })
    .post('/signup', async ({ body, jwt }) => {
      const check = await db.select().from(usersTable).where(eq(usersTable.email, body.email))
      if (check.length !== 0) {
        return "user already exists"
      }
      try{
        const cuser = await db.insert(usersTable).values({
          name: body.name,
          email: body.email,
          password: body.password
        });

        const user = await db.select().from(usersTable).where(eq(usersTable.email, body.email))
    
      
        const token = await jwt.sign({id: user[0].id})
        console.log(token);
        return {
          token
        };
      }catch(e) {
        console.log(e);
        return e;
      }
      
    }, {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
        }),
        
    })
    .get('/login', async ({ body, jwt }) => {
      const user = await db.select().from(usersTable).where(eq(usersTable.email, body.email))
      if (user.length === 0) {
        return "user not found"
      }
      const token = await jwt.sign({id: user[0].id})
      return {
        token
      };
    }, {
      body: t.Object({
          name: t.String(),
          email: t.String(),
          password: t.String(),

      })
    })
    .onError(({ code }) => {
      if (code === 'NOT_FOUND')
          return 'Route not found :('
    })
    .listen(3000);




console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);


// const cuser = await db.insert(usersTable).values({
                    //   name: body.name,
                    //   email: body.email,
                    //   password: body.password
                    // }).execute()
                  
                    // const user = await db.query.usersTable.findFirst();
                    // console.log(user);
                    // return user;