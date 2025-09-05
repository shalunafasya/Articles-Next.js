import { NextResponse } from "next/server";
import { getUsers, saveUsers } from "@/lib/users";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();

  const users = getUsers();
  const exists = users.find((u = users) => u.email === email);

  if (exists) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role,
  };

  users.push(newUser);
  saveUsers(users);

  return NextResponse.json({ user: newUser });
}
