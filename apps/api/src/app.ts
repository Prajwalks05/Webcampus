import "dotenv/config";
import userRouter from "@webcampus/api/src/routers/admin/user.router";
import DepartmentRouter from "@webcampus/api/src/routers/department/department.router";
import { auth, toNodeHandler } from "@webcampus/auth";
import { backendEnv } from "@webcampus/common/env";
import cors from "cors";
import express from "express";
import adminRouter from "./routers/admin/admin.router";
import hodRouter from "./services/hod/hod.router";

const app = express();

app.use(
  cors({
    origin: backendEnv().FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.all("/api/auth/{*any}", toNodeHandler(auth));
/**
 * Mount express json middleware after Better Auth handler
 **/
app.use(express.json());

app.use("/admin", adminRouter);

app.use("/user", userRouter);

app.use("/hod", hodRouter);

app.use("/department", DepartmentRouter);

app.get("/", (req, res) => {
  res.send({
    message: "Server is Up and Running",
  });
});

export default app;
