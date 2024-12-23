import avatar3 from "@/public/images/avatar/avatar-3.jpg";
export const user = [
  {
    id: 1,
    name: "msaatylaw",
    image: avatar3,
    password: "password",
    email: "msaatylaw@gmail.com",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
  {
    id: 2,
    name: "lawyer",
    image: avatar3,
    password: "password",
    email: "lawyer@gmail.com",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
  {
    id: 2,
    name: "client",
    image: avatar3,
    password: "password",
    email: "client@gmail.com",
    resetToken: null,
    resetTokenExpiry: null,
    profile: null,
  },
];

export type User = (typeof user)[number];
