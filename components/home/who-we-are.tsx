import React, { Fragment } from 'react';
import { SwiperSlide } from 'swiper/react';

function WhoWeAre() {
  return (
    <Fragment>
      {/* slide 2 */}
      <SwiperSlide className="slide">
        <div className="slide-content">
          <h1 className="blackColor" style={{ animationDelay: '0.01' }}>
            {' '}
            foresight{' '}
          </h1>
          <p
            className="para italics blackColor"
            style={{ animationDelay: '0.6s' }}
          >
            The ability to judge correctly what is going to happen in the future
            and plan your action based on this knowledge.
          </p>
        </div>
      </SwiperSlide>

      {/* slide 3 */}
      <SwiperSlide className="slide">
        <div className="slide-content">
          <h1 className="blackColor" style={{ animationDelay: '0.01s' }}>
            vision
          </h1>
          <p
            className="para italics blackColor"
            style={{ animationDelay: '0.6s' }}
          >
            The act of using imagination and wisdom to set meaningful and
            inspiring goals grounded with purpose.
          </p>
        </div>
      </SwiperSlide>

      {/* slide 4 */}
      <SwiperSlide className="slide">
        <div className="slide-content">
          <p
            className="para wide blackColor"
            style={{ animationDelay: '0.01s' }}
          >
            Our vision is focused on the convergence of technologies that will
            affect the way we live and work in the coming years: blockchain,
            artificial intelligence, spatial computing, advanced data management
            systems, robotics,...
          </p>
          <p
            className="para wide blackColor"
            style={{ animationDelay: '0.3s' }}
          >
            By staying ahead of current trends, we future-proof our clients so
            that they anticipate, leap forward, and develop new operation models
            that align with what is to come.
          </p>
          <p
            className="para wide blackColor"
            style={{ animationDelay: '0.6s' }}
          >
            We look beyond [ what’s next ], to [ what’s after next ].
          </p>
        </div>
      </SwiperSlide>
    </Fragment>
  );
}

export default WhoWeAre;
