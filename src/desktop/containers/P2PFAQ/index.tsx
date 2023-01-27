import * as React from 'react';
import { PlusIcon } from 'src/assets/images/P2PIcon';

export const P2PFAQ: React.FC = () => {
    const data = [
        { faq: 'How do I make a payment?' },
        { faq: 'Is it safe to make payment to the seller？' },
        { faq: 'What should I look out for during the payment transfer?' },
        { faq: 'What do I do if the payment failed?' },
        { faq: 'What if I do not want to trade anymore?' },
        { faq: 'Does the seller charge a transaction fee？' },
    ];
    return (
        <div className="container-faq-p2p">
            <h1 className="m-0 p-0 white-text text-ms font-bold mb-16">FAQ</h1>

            <div>
                {data.map((el, i) => (
                    <div key={i} className="d-flex align-content-center mb-16">
                        <span className="mr-16">
                            <PlusIcon />
                        </span>
                        <p className="m-0 p-0 white-text text-sm">{el.faq}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
