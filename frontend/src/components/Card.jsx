import icon_arrow from '../assets/arrow-icon.png'
import './components.css'

// This is for Landing page

export default function Card() {
    return (
        <>
            <div className="cardOuter">
                <h3 className=''>This is a sample header</h3>
                <p className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    In similique exercitationem explicabo perferendis eaque quidem atque! 
                    Maiores atque nobis laborum veniam, 
                    esse inventore et, iusto cum ullam mollitia dignissimos quae!
                </p>
                <a href="/">Read more <img src={icon_arrow} height="15px" width="15px"></img></a>
            </div>
        </>
    );
}