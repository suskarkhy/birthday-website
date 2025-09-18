import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const links = [
    { label: "Birthday #26", href: "/26" },
    {
      label: "Birthday #27 (click me)",
      href: "/27",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-lvh gap-10">
      <Image
        width={10}
        height={10}
        src="/yippie.gif"
        alt="cat"
        className="w-16"
      />
      {links.map((link) => (
        <Link href={link.href} key={link.href}>
          <div className="text-lg underline cursor-pointer font-mono font-bold">
            {link.label}
          </div>
        </Link>
      ))}
    </div>
  );
}
