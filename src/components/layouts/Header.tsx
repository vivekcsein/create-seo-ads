import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full h-20 sticky top-0 glass-effect">
      <div className="w-full h-full flex items-center justify-between">
        <Link href="/" className="w-full text-center">
          <h4> This page is made to show ads</h4>
        </Link>
      </div>
    </header>
  );
};

export default Header;
