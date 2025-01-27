import Link from 'next/link';
import NavbarConnectWallet from './navbar-connect-wallet';
import NavbarLink from './navbar-link';

export interface NavbarProps {
    activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({ activePage }) => {
    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-white shadow-sm">
            <div className="container-md">
                <Link href="/">
                    <a className="navbar-brand" href="/">
                        <img
                            src="/logo.png"
                            height="30"
                            className="d-inline-block align-top"
                            alt="Rollercoaster"
                            loading="lazy"
                        />
                    </a>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbar-nav"
                    aria-controls="navbar-nav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbar-nav">
                    <ul className="navbar-nav mr-auto">
                        <NavbarLink href="/" activeHref={activePage}>
                            Home
                        </NavbarLink>
                        <NavbarLink href="/presale" activeHref={activePage}>
                            Presale
                        </NavbarLink>
                        <NavbarLink href="/farm" activeHref={activePage}>
                            Farm
                        </NavbarLink>
                        <NavbarLink href="/harvest-history" activeHref={activePage}>
                            Harvest History
                        </NavbarLink>
                        <NavbarLink href="/buyback" activeHref={activePage}>
                            Buyback
                        </NavbarLink>
                        <NavbarLink href="/governance" activeHref={activePage}>
                            Governance
                        </NavbarLink>
                    </ul>

                    <NavbarConnectWallet />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
