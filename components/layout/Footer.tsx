import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-foreground text-background">
        <div className="md:container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src={'/logowhite.svg'} alt="" width={100} height={100} />
            </Link>
            <div className="flex items-center gap-6 text-sm opacity-70">
              <Link href="/features" className="hover:opacity-100 transition-opacity">Features</Link>
              <Link href="/pricing" className="hover:opacity-100 transition-opacity">Pricing</Link>
              <Link href="/how-it-works" className="hover:opacity-100 transition-opacity">How It Works</Link>
            </div>
            <p className="text-sm opacity-50">© 2024 MindForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}
