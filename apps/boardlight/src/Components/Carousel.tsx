import * as React from 'react';
import Carousel, { autoplayPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import style from '../CSS/login.module.css';
import Center from './Center';

const LoginCarousel = (): JSX.Element => {
    return (
        <div className={String(style.center)}>
            <Carousel
                plugins={[
                    'infinite',
                    'centered',
                    {
                        resolve: autoplayPlugin,
                        options: {
                            interval: 2000,
                        },
                    },
                ]}>
                <div className={style.adText}>
                    <Center>
                        <h2>Lorem Ipsum</h2>
                    </Center>
                    <p className="text-justify">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean convallis
                        accumsan tortor eu euismod. Duis turpis velit, scelerisque id varius non,
                        ultricies eget ligula. In quis massa sed nunc laoreet elementum sit amet eu
                        nisl. Praesent molestie pretium aliquet. Donec sollicitudin nisl at elit
                        efficitur tincidunt. Nulla eu mauris ut nisl tempor dapibus. Phasellus ac
                        massa posuere, sagittis erat luctus, cursus tortor. Aenean aliquam arcu dui,
                        vitae ullamcorper erat vehicula quis. Donec sit amet urna porta, tempus
                        mauris non, faucibus libero.
                    </p>
                </div>
                <div className={style.adText}>
                    <Center>
                        <h2>Megint Ipsum</h2>
                    </Center>
                    <p className="text-justify">
                        Vestibulum placerat vestibulum vestibulum. Sed vel placerat sapien, et
                        mollis tellus. In a lorem blandit, lobortis ante nec, efficitur elit. Proin
                        aliquam eget nisi eget venenatis. Donec accumsan mollis lectus, tristique
                        volutpat ipsum malesuada ut. Sed porttitor posuere consequat. Pellentesque
                        cursus turpis sed eleifend gravida. Etiam ultricies auctor elit, quis auctor
                        augue sollicitudin ac.
                    </p>
                </div>
                <div className={style.adText}>
                    <Center>
                        <h2>Eskü Latin</h2>
                    </Center>
                    <p className="text-justify">
                        Morbi feugiat augue vel consequat rhoncus. Sed feugiat nec neque in viverra.
                        Integer posuere porta turpis quis pretium. Mauris sapien dolor, volutpat sit
                        amet justo egestas, ornare semper mauris. Etiam elit justo, vehicula eu
                        consequat in, tempor aliquam elit. Proin ultricies interdum nulla in
                        hendrerit. Duis non justo velit. Aliquam dapibus sollicitudin nisl et
                        pharetra. Morbi sit amet consequat nunc. Suspendisse tincidunt orci id
                        tortor bibendum, ac mollis elit bibendum. Fusce sed ex eu nisi suscipit
                        consequat id quis dui.
                    </p>
                </div>
            </Carousel>
        </div>
    );
};

export default React.memo(LoginCarousel);
