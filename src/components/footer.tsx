import FooterSocialLink from "./footer-social-link"

const Footer: React.FC<{}> = () => {
    return (
        <footer className="bg-white shadow-sm">
            <div className="container-md">
                <div className="row">
                    <div className="col-12 text-center py-5">
                        <div className="mb-3">
                            <FooterSocialLink title="Rollercoaster on Twitter" icon="twitter" href="https://twitter.com/RollerFinance" />
                            <FooterSocialLink title="Rollercoaster on Telegram" icon="telegram-plane" href="https://t.me/RollerCoasterFinance" />
                            <FooterSocialLink title="Rollercoaster on Discord" icon="discord" href="https://discord.gg/esDnAMX38B" />
                            <FooterSocialLink title="Rollercoaster on Medium" icon="medium-m" href="https://medium.com/@rollercoasterfinance" />
                            <FooterSocialLink title="Rollercoaster on GitHub" icon="github" href="https://github.com/rollercoasterfinance" isLast={true} />
                        </div>
                        <p>Copyright © 2021, Rollercoaster.finance</p>
                        <p className="mb-0">Rollercoaster is a DeFi experiment. The investor is fully responsible for the investment.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;