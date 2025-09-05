import users from "@/dummy/users.json";

export function fakeLogin(email: string, password: string) {
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const token = btoa(`${user.id}:${user.email}:${user.role}`);
  localStorage.setItem("token", token);
  return { token, user };
}

export function fakeRegister(name: string, email: string, password: string) {
  const exists = users.find(u => u.email === email);
  if (exists) {
    throw new Error("Email already exists");
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: "user"
  };

  const token = btoa(`${newUser.id}:${newUser.email}:${newUser.role}`);
  localStorage.setItem("token", token);

  return { token, user: newUser };
}

export function fakeLogout() {
  localStorage.removeItem("token");
}
