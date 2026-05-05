import { useEffect, useState } from 'react';
import { siteContentAPI } from '@lib/api';

const D = {
  stickerYears:      '8+',
  stickerText:       '✦ Since 2018 · Long Island New York · Made With Love',
  mainPhotoUrl:      'http://jtsrusticcuisine.com/wp-content/uploads/2023/05/About-Us-Photo.png',
  mainPhotoCaption:  '— Chef Jessy T in the kitchen —',
  smallPhotoCaption: 'fresh herbs',
  title:             'Born from a belief\nthat great food\nbrings people home.',
  body:              "JT's Rustic Cuisine was founded on a simple idea — food should taste like a memory. Every dish we serve is made from scratch in our New York kitchen, using real ingredients and recipes passed down through generations of family cooks. No shortcuts. No substitutions. Just comfort food with soul.",
  quote:             "My mother taught me that cooking isn't about following a recipe — it's about feeding the people you love.",
  chefSignature:     '— Chef Jessy T',
  chefName:          'Jessica Thomas',
  chefRole:          'Founder & Head Chef',
};

export default function About() {
  const [a, setA] = useState(D);

  useEffect(() => {
    siteContentAPI.get()
      .then((res) => { if (res.data.content?.about) setA({ ...D, ...res.data.content.about }); })
      .catch(() => {});
  }, []);

  return (
    <section className="about" id="about">
      <div className="coffee-stain" style={{ top: 80, right: '8%', transform: 'rotate(12deg)' }} />

      <div className="about__grid">
        {/* Media column */}
        <div className="about__media">
          <div className="about__sticker">
            <div className="about__sticker-bg" />
            <svg className="about__sticker-svg" viewBox="0 0 140 140">
              <defs>
                <path id="stickerPath"
                  d="M 70, 70 m -54, 0 a 54,54 0 1,1 108,0 a 54,54 0 1,1 -108,0" />
              </defs>
              <text>
                <textPath href="#stickerPath" className="about__sticker-text">
                  {a.stickerText}
                </textPath>
              </text>
            </svg>
            <div className="about__sticker-center">
              <div className="about__sticker-num">{a.stickerYears}</div>
              <div className="about__sticker-word">Years of<br />Flavor</div>
            </div>
          </div>

          <div className="about__polaroid about__polaroid--main">
            <div className="tape about__tape about__tape--1" />
            <div className="about__photo-inner about__photo-inner--1">
              <img src={a.mainPhotoUrl} alt={a.mainPhotoCaption} />
            </div>
            <div className="about__polaroid-caption">{a.mainPhotoCaption}</div>
          </div>

          <div className="about__polaroid about__polaroid--small">
            <div className="tape about__tape about__tape--2" />
            <div className="about__photo-inner about__photo-inner--2">
              <div className="about__photo-emoji" />
            </div>
            <div className="about__polaroid-caption about__polaroid-caption--small">
              {a.smallPhotoCaption}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="about__content">
          <div className="about__folio">
            <span className="about__folio-ch">Ch. 02</span>
            <span>Our Story</span>
          </div>
          <h2 className="about__title">
            Born from a belief<br />
            that <em>great food</em><br />
            brings people <span className="about__title-ul">home</span>.
          </h2>
          <p className="about__body">{a.body}</p>
          <blockquote className="about__quote">
            "{a.quote}"
          </blockquote>
          <div className="about__sig-row">
            <div className="about__signature">{a.chefSignature}</div>
            <div className="about__sig-line">
              <div className="about__sig-name">{a.chefName}</div>
              <div className="about__sig-role">{a.chefRole}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
