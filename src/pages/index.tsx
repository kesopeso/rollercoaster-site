import Head from 'next/head';
import React from 'react';

const Home: React.FC<{}> = () => {
    
    return (
        <>
            <Head>
                <title>ROLLERcoaster | Home - rollercoaster.finance</title>
            </Head>

            <section className="py-12">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-6 order-md-2">
                            <img src="/rollercoaster.png" className="img-fluid mw-md-150 mw-lg-130 mb-6 mb-md-0"></img>
                        </div>
                        <div className="col-12 col-md-6 order-md-1">
                            <h1>Welcome to <span className="text-primary">ROLLER coaster</span></h1>
                            <p className="lead text-center text-md-left text-muted mb-6 mb-lg-8 mb-3">
                            Welcome to the most exciting ROLLER coaster adventure in the DeFi Realm
                            </p>
                            <div className="text-center text-md-left">
                                <a href="/presale" className="btn btn-lg btn-primary mr-1">Presale</a>
                                <a href="/farm" className="btn btn-lg btn-primary mr-1">Farm</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6 bg-white">
                <div className="container">
                    <div className="row align-items-center text-center">
                        <div className="col-8 offset-2">
                        <h1>What is <span className="text-primary">ROLLER coaster?</span></h1>
                        <br />
                        <p className="lead text-center text-muted">
                        We aim to develop a sustainable collection of thrilling yet user-friendly DeFi products open and accessible for all. Who doesn’t love to feel the Force, yet feel safe, anyway? In the exciting, yet unpredictable world of finance today, it is time to focus on transparency, community, and sustainability. So, feel free to experience the magical force of the Defi finance world with the ROLL. 
                        </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-6">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="row align-items-center text-center">
                                <div className="col-8 offset-2">
                                    <h1 className="text-primary">Roadmap</h1>
                                    <br />
                                </div>
                            </div>
                            <div className="main-timeline">
                                <div className="timeline">
                                    <div className="timeline-icon"><span className="year">1</span></div>
                                    <div className="timeline-content">
                                        <h3 className="title">Private sale</h3>
                                        <p className="description">
                                            Once we start the presale process, everybody who is whitelisted will be able to contribute.
                                            If by the end of the presale hardcap is not reached, we will open contributions for everyone on FCFS basis.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-icon"><span className="year">2</span></div>
                                    <div className="timeline-content">
                                        <h3 className="title">Providing Liquidity</h3>
                                        <p className="description">
                                        Total 360 ETH is going to be used for Uniswap liqudity.
                                        We'll start adding 30 ETH to liquidity each day after the listing on Uniswap, and so on for the next 10 days.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-icon"><span className="year">3</span></div>
                                    <div className="timeline-content">
                                        <h3 className="title">Farming</h3>
                                        <p className="description">
                                        Every pool is allocated a certain amount of ROLL tokens immediately after the presale ends. 
                                        Every 10 days reward halving occures, starting with the half of the pool's total tokens allocation. 
                                        Rewards are distributed among the pool contributors.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-icon"><span className="year">4</span></div>
                                    <div className="timeline-content">
                                        <h3 className="title">Buy Back</h3>
                                        <p className="description">
                                        Afte providing liquidity we will start with buyabck program.
                                        Buyback will occure 3 times every 24h. Each time contract will buy 50 ETH. 
                                        </p>
                                    </div>
                                </div>

                                <div className="timeline">
                                    <div className="timeline-icon"><span className="year">5</span></div>
                                    <div className="timeline-content">
                                        <h3 className="title">DAO</h3>
                                        <p className="description">
                                        Governance tokens, which give holders the right to influence the direction of Rollercoaster finance, have been among the biggest hits in the Ethereum ecosystem lately.
                                        After successfull launch we will implement voting system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;