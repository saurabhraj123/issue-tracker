import NavLink from "next/link";
import { Link as RadixLink } from "@radix-ui/themes";

interface Props {
  href: string;
  children: React.ReactNode;
}

const Link = ({ href, children }: Props) => {
  return (
    <NavLink href={href} passHref legacyBehavior>
      <RadixLink>{children}</RadixLink>
    </NavLink>
  );
};

export default Link;
