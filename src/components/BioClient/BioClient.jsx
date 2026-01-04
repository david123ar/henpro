"use client";

import React, { useMemo } from "react";
import "./bio.css";
import { themeStyles, backgroundToTheme } from "@/styles/themeStyles";
import Link from "next/link";

// ----------------------
// STATIC DATA ARRAY
// ----------------------
const data = [
  "Gobaku: Moe Mama Tsurezure",
  "Ano ko no kawari ni Suki na Dake",
  "Akogare na Onna Joushi ga",
  "Hametsu no yuuwaku",
  "Akogare na Onna Joushi ga",
  "Netoraserare",
  "Succubus Yondara",
  "Eroriman: Junjou Meikko o Loveho ni Tsurekonde Yaritai Houdai",
  "Kokuhaku: Ijime Namaiki Douji Gal no Uragawa",
  "Eroriman 2",
  "Imouto to Sono Yuujin ga Ero Sugite Ore no Kokan ga Yabai",
  "Dearest Blue",
  "Wife-Swap Diaries",
  "Notto Sexaroid Eurie!",
  "Mama Katsu: Midareru Mama-tachi no Himitsu",
  "Fuuki Iin to Fuuzoku Katsudou",
  "Toriko no Kusari: Shojo-tachi wo Yogosu Midara na Kusabi",
  "Seiso de Majime na Kanojo ga, Saikyou Yaricir ni Kanyuu Saretara…? The Animation",
  "Harem in the Labyrinth",
  "First Love",
  "Issho ni H Shiyo",
  "Sex ga Suki de Suki de Daisuki na Classmate no Ano Musume",
  "Eroriman: Junjou Meikko o Loveho ni Tsurekonde Yaritai Houdai",
  "Amai Ijiwaru",
  "Kazoku: Haha to Shimai no Kyousei",
  "Kokuhaku: Ijime Namaiki Douji Gal no Uragawa",
  "MaMa 1",
  "Sex ga Suki de Suki de Daisuki na Classmate no Ano Musume",
  "Yamitsuki Pheromone The Animation",
  "Shishunki no Obenkyou",
  "Tsun M! Gyutto Shibatte Shidoushite The Animation",
  "Tsugunai",
  "Miboujin Nikki: Akogare no Ano Hito to Hitotsu Yane no Shita",
  "Korashime 2: Kyouikuteki Depaga Shidou",
  "Mama Katsu: Midareru Mama-tachi no Himitsu",
  "Aibeya The Animation",
  "Nee shiyo",
  "Kimi wa Yasashiku Netorareru The Animation",
  "Secret Mission: Sennyuu Sousakan wa Zettai ni Makenai!",
  "Yumemiru Otome",
  "Iinari! Saimin Kanojo",
  "Boku no Risou no Isekai Seikatsu",
  "Cleavage",
  "Oni Chichi 2: Revenge",
  "idol sisters",
  "Maid in Heaven SuperS",
  "First Love",
  "Bakunyuu Bomb",
  "White Blue",
  "Nee shiyo",
  "Konomi ja Nai kedo: Mukatsuku Ane to Aishou Batsugun Ecchi",
  "Midareuchi",
  "First Love",
  "Tonari no Kanojo",
  "Tonari no Kanojo",
  "White Blue",
  "Junjou Shoujo Et Cetera",
  "Kuro no Kyoushitsu",
  "Konomi ja Nai kedo: Mukatsuku Ane to Aishou Batsugun Ecchi",
  "Soshite Watashi wa Ojisan ni",
  "Reunion",
  "Gakuen de Jikan yo Tomare",
  "Hametsu no Yuuwaku",
  "Princess Burst!",
  "Gibo no Toiki: Haitoku Kokoro ni Tadayou Haha no Iroka",
  "Chiisana Tsubomi no Sono Oku ni",
  "Dekichau made Kon",
  "Oni Chichi 2: Revenge",
  "Kazoku: Haha to Shimai no Kyousei",
  "Shishunki no Obenkyou",
  "Dekichau made Kon",
  "Asa made Shirudaku Oyakodon!!",
  "Hump Bang",
  "Milk Money",
  "Aniyome",
  "Miboujin Nikki: Akogare no Ano Hito to Hitotsu Yane no Shita",
  "Ojisan de Umeru Ana The Animation",
  "Vampire",
  "Dekichau made Kon",
  "Maki-chan to Now.",
  "Hime-sama Love Life!",
  "MaMa 2",
  "Dekichau made Kon",
  "Helter Skelter: Hakudaku no Mura",
  "Succubus Yondara Haha Ga Kita!?",
  "Immoral Game Master The Animation",
  "Ane Yome Quartet",
  "Sweet Home: H na Onee-san wa Suki Desu ka?",
  "Asa made Shirudaku Oyakodon!!",
  "Immoral Game Master The Animation",
  "Taboo Charming Mother",
  "Kyou wa Yubiwa wo Hazusu kara",
  "Fuuki Iin to Fuuzoku Katsudou",
  "Kazoku: Haha to Shimai no Kyousei",
  "Imouto wa Gal Kawaii",
  "Nozoki Kanojo",
  "Furifure 2",
  "Asa made Shirudaku Oyakodon!!",
  "Soshite Watashi wa Ojisan ni",
  "MaMa 1",
  "Cleavage",
  "Ero Ishi: Seijun Bishoujo wo Kotoba Takumi ni Hametai Houdai",
  "Iribitari Gal ni Manko Tsukawasete Morau Hanashi",
  "Oyasumi Sex",
  "Bakunyuu Bomb",
  "Taboo Charming Mother",
  "Ano Ko no Kawari ni Suki na Dake",
  "Kakushi Dere",
  "Netoraserare",
  "Issho ni H Shiyo",
  "Debt Sisters",
  "Boku no Risou no Isekai Seikatsu",
  "Kakushi Dere",
  "Bijukubo",
  "Dekichau made Kon",
  "Gakuen de Jikan yo Tomare",
  "Taboo Charming Mother",
  "Amai Ijiwaru",
  "Mama Katsu: Midareru Mama-tachi no Himitsu",
  "Gobaku: Moe Mama Tsurezure",
  "Koiito Kinenbi The Animation",
  "Hitozuma Life One Time Gal Prequel",
  "Gogo no Kouchou: Junai Mellow yori",
  "Princess Burst!",
  "Eroge! H mo Game mo Kaihatsu Zanmai",
  "Cleavage",
  "M.E.M.: Yogosareta Junketsu",
  "Ane Koi: Suki Kirai Daisuki.",
  "Kanojo ga Yatsu ni Idakareta Hi",
  "Dekichau made Kon",
  "Tropical Kiss",
  "Sister Breeder",
  "Taboo Charming Mother",
  "Netoraserare",
  "Succubus Yondara Haha Ga Kita!?",
  "Oni Chichi 2: Revenge",
  "Imouto Paradise! 2",
  "Tsuma wo Dousoukai ni Ikasetara",
  "Boku no Risou no Isekai Seikatsu",
  "Gibo no Toiki: Haitoku Kokoro ni Tadayou Haha no Iroka"
];

// slugify
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const BioClient = ({ user, creator, accounts = {}, design }) => {
  const uname = user?.username?.toLowerCase() || "";

  const designName = design?.split("/")?.pop()?.split(".")[0];
  const themeKey = backgroundToTheme[designName] || "redWhiteBlack";
  const theme = themeStyles[themeKey];

  return (
    <div className="page-wrapper">
      <div className="bio-page">
        <img
          src={design || "/done.jpeg"}
          alt="background"
          className="bio-background"
        />

        <div className="bio-content">
          {/* TOP AD */}
          <div
            className="bio-ad ad-top"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
              backgroundColor: "#201f31",
            }}
          >
            <iframe
              src="/ad"
              title="Sponsored Ad"
              scrolling="no"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                width: "100%",
                maxWidth: "728px",
                height: "70px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#201f31",
              }}
            />
          </div>

          {/* AVATAR */}
          <div
            className="bio-avatar"
            style={{
              border: `3px solid ${theme.avatarBorder}`,
              boxShadow: theme.avatarShadow,
              background: "#000",
            }}
          >
            <img
              src={
                uname === "animearenax"
                  ? "/arenax.jpg"
                  : user.avatar?.replace(
                      "https://img.flawlessfiles.com/_r/100x100/100/avatar/",
                      "https://cdn.noitatnemucod.net/avatar/100x100/"
                    ) || "/default-avatar.png"
              }
              alt="avatar"
              className="rounded-full w-24 h-24 object-cover"
            />
          </div>

          {/* USERNAME */}
          <div
            className="bio-username"
            style={{
              background: theme.usernameBg,
              color: theme.usernameColor,
              boxShadow: theme.usernameShadow,
            }}
          >
            {user.username}
          </div>

          {/* BIO */}
          <div
            className="bio-description"
            style={{
              background: theme.descriptionBg,
              color: theme.descriptionColor,
              boxShadow: theme.descriptionShadow,
            }}
          >
            {user.bio || "Check out my sauce below!"}
          </div>

          {/* LINKS USING data ARRAY */}
          <div
            className="bio-links"
            style={{
              scrollbarColor: `${theme.scrollbarThumb} transparent`,
            }}
          >
            {data.map((title, index) => (
              <Link
                key={index}
                href={`/watch/${toSlug(title)}?creator=${user.username}`}
                className="bio-link"
                style={{
                  background: theme.linkBg,
                  color: theme.linkColor,
                  boxShadow: theme.linkShadow,
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  padding: "4px",
                  height: "64px",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = theme.linkHoverBg;
                  e.currentTarget.style.boxShadow =
                    theme.linkHoverShadow;
                  e.currentTarget.style.transform =
                    "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = theme.linkBg;
                  e.currentTarget.style.boxShadow = theme.linkShadow;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Placeholder Poster */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#333",
                    marginRight: "12px",
                  }}
                >
                  <img
                    src="/placeholder.webp"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontWeight: "600",
                    fontSize: "1.1rem",
                  }}
                >
                  #{data.length - index} Sauce
                </div>
              </Link>
            ))}
          </div>

          {/* BOTTOM AD */}
          <div
            className="bio-ad ad-bottom"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "10px 0",
              backgroundColor: "#201f31",
            }}
          >
            <iframe
              src="/ad"
              title="Sponsored Ad"
              scrolling="no"
              style={{
                width: "100%",
                maxWidth: "728px",
                height: "70px",
                border: "none",
                borderRadius: "10px",
                backgroundColor: "#201f31",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioClient;
