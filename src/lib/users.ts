import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src/dummy/users.json");

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export function getUsers() {
  const data = fs.readFileSync(usersFile, "utf-8");
  return JSON.parse(data);
}

export function saveUsers(users: User[]) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}
