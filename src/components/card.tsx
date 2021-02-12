import cn from 'classnames';

export interface CardProps {
    titleIconClassName: string;
    titleText: string;
}

const Card: React.FC<CardProps> = ({ children, titleIconClassName, titleText }) => {
    const titleIconClasses = cn({
        'mr-2': true,
        [titleIconClassName]: true,
    });

    return (
        <div className="card shadow">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h5 className="card-title font-weight-bold">
                    <i className={titleIconClasses} />
                    {titleText}
                </h5>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default Card;
