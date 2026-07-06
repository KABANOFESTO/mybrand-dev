const payments = [
    { client: 'Kigali Commerce Hub', amount: '$1,200', status: 'Paid' },
    { client: 'Solve It', amount: '$680', status: 'Pending' },
    { client: 'Personal Brand Refresh', amount: '$350', status: 'Draft Invoice' },
];

const OwnerEarningsPage = () => {
    return (
        <div className="owner-page-stack">
            <section className="owner-page-hero">
                <div>
                    <p className="owner-section-eyebrow">My-Earning (Payments)</p>
                    <h3>Payments overview</h3>
                    <span>Track the money side of your work in a clear and simple way.</span>
                </div>
            </section>

            <section className="owner-simple-grid owner-simple-grid-three">
                <article className="owner-simple-card">
                    <p>Total revenue</p>
                    <strong>$8,420</strong>
                    <span>+14% this month</span>
                </article>
                <article className="owner-simple-card">
                    <p>Pending payments</p>
                    <strong>$1,030</strong>
                    <span>2 clients waiting</span>
                </article>
                <article className="owner-simple-card">
                    <p>Average project value</p>
                    <strong>$935</strong>
                    <span>Stable trend</span>
                </article>
            </section>

            <section className="owner-simple-panel">
                <div className="owner-card-heading">
                    <h4>Recent payments</h4>
                    <span>Latest transactions</span>
                </div>
                <div className="owner-table-list">
                    {payments.map((payment) => (
                        <div key={payment.client} className="owner-table-row">
                            <div>
                                <strong>{payment.client}</strong>
                                <span>{payment.status}</span>
                            </div>
                            <strong>{payment.amount}</strong>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default OwnerEarningsPage;
