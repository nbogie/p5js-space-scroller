
let gPalette: Palette;
type ColourName = 'white' | 'black'
let stdColours: Record<ColourName, p5.Color>;

const FaveColors = {
    paletteStrs: [
        "#F8B195,#F67280,#C06C84,#6C5B7B,#355C7D,#F8B195,#F67280,#C06C84|1001 stories|http://www.colourlovers.com/palette/1811244/1001_Stories",
        "#5E412F,#FCEBB6,#78C0A8,#F07818,#F0A830,#5E412F,#FCEBB6,#78C0A8|papua new guinea|http://www.colourlovers.com/palette/919313/Papua_New_Guinea",
        "#452632,#91204D,#E4844A,#E8BF56,#E2F7CE,#452632,#91204D,#E4844A|trance|http://www.colourlovers.com/palette/594151/t_r_a_n_c_e",
        "#F0D8A8,#3D1C00,#86B8B1,#F2D694,#FA2A00,#F0D8A8,#3D1C00,#86B8B1|koi carp|http://www.colourlovers.com/palette/656966/Koi_Carp",
        "#FF4E50,#FC913A,#F9D423,#EDE574,#E1F5C4,#FF4E50,#FC913A,#F9D423|dance to forget|http://www.colourlovers.com/palette/937624/Dance_To_Forget",
        "#99B898,#FECEA8,#FF847C,#E84A5F,#2A363B,#99B898,#FECEA8,#FF847C|coup de grace|http://www.colourlovers.com/palette/1098589/coup_de_gr%C3%A2ce",
        "#FF4242,#F4FAD2,#D4EE5E,#E1EDB9,#F0F2EB,#FF4242,#F4FAD2,#D4EE5E|wasabi suicide|http://www.colourlovers.com/palette/482416/Wasabi_Suicide",
        "yellow,yellow,gray||",
        "#c70000,#f4b600,#2d2bb4,black||",
        "black,gray,white||",
        "white||",
        "#FE4365,#FC9D9A,#F9CDAD,#C8C8A9,#83AF9B,#FE4365,#FC9D9A,#F9CDAD||",
        "#69D2E7,#A7DBD8,#E0E4CC,#F38630,#FA6900,#69D2E7,#A7DBD8,#E0E4CC||",
        "#556270,#4ECDC4,#C7F464,#FF6B6B,#C44D58,#556270,#4ECDC4,#C7F464||",
        "#E94E77,#D68189,#C6A49A,#C6E5D9,#F4EAD5|LoversInJapan by lovelyrita|http://www.colourlovers.com/palette/867235/LoversInJapan",
        "#00A0B0,#6A4A3C,#CC333F,#EB6841,#EDC951|Ocean Five by DESIGNJUNKEE|http://www.colourlovers.com/palette/1473/Ocean_Five",
        "#B9D7D9,#668284,#2A2829,#493736,#7B3B3B|Entrapped InAPalette by annajak|",
        "#D1F2A5,#EFFAB4,#FFC48C,#FF9F80,#F56991|mellon ball surprise by Skyblue2u|",
        "#00A8C6,#40C0CB,#F9F2E7,#AEE239,#8FBE00|fresh cut day by electrikmonk|"
    ],
    createPalettes: function () {
        const makePalette = (str: string) => {
            const [colorsStr, name, url] = str.split("|");
            return {
                colors: colorsStr.split(",").map((n: string) => color(n)),
                name: name,
                url: url
            };
        };

        const palettes = FaveColors.paletteStrs.map(makePalette);
        return palettes;
    },
    randomPalette: function () {
        return random(FaveColors.createPalettes());
    },

    randomBigPalette: function (minSize: number) {
        return random(
            FaveColors.createPalettes().filter(p => p.colors.length >= minSize)
        );
    },
    randomMonoPalette: function () {
        const pal = Object.assign({}, FaveColors.randomPalette());
        pal.colors = _.sampleSize(pal.colors, 2);
        return pal;
    }
};

function setupStandardColours() {
    stdColours = { white: color('white'), black: color('black') }
}

function randomizePalette() {
    gPalette = FaveColors.randomPalette();
}
function randomizeBigPalette() {
    gPalette = FaveColors.randomBigPalette(5);
}
function randomizeMonoPalette() {
    gPalette = FaveColors.randomMonoPalette();
}

function randomColor() {
    return random(gPalette.colors);
}
function createEmptyColor(): p5.Color {
    return color(255, 0);
}
function randomColorOrTransparent() {
    return random([randomColor(), createEmptyColor()]);
}


function setPaletteForResources() {
    randomizeBigPalette();
    resTypes.forEach((rt, ix) => {
        rt.color = gPalette.colors[ix];
    });
}


function getColorForShipHP(hp: number) {
    return lerpColor(color("red"), color("green"), (max(hp, 20) - 20) / 100);
}