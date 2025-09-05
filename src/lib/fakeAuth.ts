import usersData from "@/dummy/users.json";

const users = [...usersData]; // biar bisa diubah di runtime

export function fakeLogin(email: string, password: string) {
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const token = btoa(`${user.id}:${user.email}:${user.role}`);
  localStorage.setItem("token", token);

  return { token, user };
}

export function fakeRegister(
  name: string,
  email: string,
  password: string,
  role: string
) {
  const exists = users.find((u) => u.email === email);
  if (exists) {
    throw new Error("Email already registered");
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role,
  };

  users.push(newUser); // hanya nambah di memori, tidak tersimpan permanen
  const token = btoa(`${newUser.id}:${newUser.email}:${newUser.role}`);
  localStorage.setItem("token", token);

  return { token, user: newUser };
}

export function fakeLogout() {
  localStorage.removeItem("token");
}
