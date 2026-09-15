import { IArtwork } from "../types";

// All images are Wikimedia Commons 960px thumbnails (not the multi-megabyte
// originals) so paintings load quickly instead of showing a blank/black
// box for several seconds while a huge image decodes.
const artworks: IArtwork[] = [
    {
        id: "1",
        title: "The Starry Night",
        artistName: "Vincent",
        artistSurname: "van Gogh",
        description: "A masterpiece of Post-Impressionist art.",
        creationYear: "1889",
        medium: "Oil on canvas",
        width: 73.7,
        height: 92.1,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
    },
    {
        id: "2",
        title: "Mona Lisa",
        artistName: "Leonardo",
        artistSurname: "da Vinci",
        description: "A portrait painting that's one of the most famous artworks in the world.",
        creationYear: "1503",
        medium: "Oil on poplar panel",
        width: 50,
        height: 70,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/960px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
    },
    {
        id: "3",
        title: "Starry Night Over the Rhône",
        artistName: "Vincent",
        artistSurname: "van Gogh",
        description: "A nocturnal scene painted on the banks of the Rhône in Arles.",
        creationYear: "1888",
        medium: "Oil on canvas",
        width: 50,
        height: 70,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Starry_Night_Over_the_Rhone.jpg/960px-Starry_Night_Over_the_Rhone.jpg"
    },
    {
        id: "4",
        title: "Girl with a Pearl Earring",
        artistName: "Johannes",
        artistSurname: "Vermeer",
        description: "One of the Dutch Golden Age's most celebrated tronies.",
        creationYear: "1665",
        medium: "Oil on canvas",
        width: 44.5,
        height: 39,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/960px-1665_Girl_with_a_Pearl_Earring.jpg"
    },
    {
        id: "5",
        title: "The Great Wave off Kanagawa",
        artistName: "Katsushika",
        artistSurname: "Hokusai",
        description: "The most famous work in the ukiyo-e series Thirty-six Views of Mount Fuji.",
        creationYear: "1831",
        medium: "Woodblock print",
        width: 60,
        height: 40,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/960px-Great_Wave_off_Kanagawa2.jpg"
    },
    {
        id: "6",
        title: "American Gothic",
        artistName: "Grant",
        artistSurname: "Wood",
        description: "An iconic depiction of rural American life.",
        creationYear: "1930",
        medium: "Oil on beaverboard",
        width: 78,
        height: 65.3,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/960px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg"
    },
    {
        id: "7",
        title: "The Birth of Venus",
        artistName: "Sandro",
        artistSurname: "Botticelli",
        description: "A masterpiece of the early Italian Renaissance.",
        creationYear: "1486",
        medium: "Tempera on canvas",
        width: 55,
        height: 90,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/960px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg"
    },
    {
        id: "8",
        title: "The Scream",
        artistName: "Edvard",
        artistSurname: "Munch",
        description: "An expressionist depiction of anxiety, one of the most recognizable images in art.",
        creationYear: "1893",
        medium: "Oil, tempera, pastel and crayon on cardboard",
        width: 91,
        height: 73.5,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/960px-The_Scream.jpg"
    },
    {
        id: "9",
        title: "Las Meninas",
        artistName: "Diego",
        artistSurname: "Velázquez",
        description: "A complex Baroque composition centered on the Spanish royal court.",
        creationYear: "1656",
        medium: "Oil on canvas",
        width: 75,
        height: 65,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg/960px-Las_Meninas%2C_by_Diego_Vel%C3%A1zquez%2C_from_Prado_in_Google_Earth.jpg"
    },
    {
        id: "10",
        title: "Water Lilies",
        artistName: "Claude",
        artistSurname: "Monet",
        description: "Part of Monet's series painted in his flower garden at Giverny.",
        creationYear: "1906",
        medium: "Oil on canvas",
        width: 85,
        height: 95,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/960px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg"
    },
    {
        id: "11",
        title: "Impression, Sunrise",
        artistName: "Claude",
        artistSurname: "Monet",
        description: "The painting that gave Impressionism its name.",
        creationYear: "1872",
        medium: "Oil on canvas",
        width: 48,
        height: 63,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Monet_-_Impression%2C_Sunrise.jpg/960px-Monet_-_Impression%2C_Sunrise.jpg"
    },
    {
        id: "12",
        title: "Sunflowers",
        artistName: "Vincent",
        artistSurname: "van Gogh",
        description: "Part of van Gogh's celebrated series of still lifes.",
        creationYear: "1888",
        medium: "Oil on canvas",
        width: 92,
        height: 73,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg/960px-Vincent_van_Gogh_-_Sunflowers_-_VGM_F458.jpg"
    },
    {
        id: "13",
        title: "Wanderer above the Sea of Fog",
        artistName: "Caspar David",
        artistSurname: "Friedrich",
        description: "A defining image of German Romanticism.",
        creationYear: "1818",
        medium: "Oil on canvas",
        width: 95,
        height: 75,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg/960px-Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog.jpeg"
    },
    {
        id: "14",
        title: "The Night Watch",
        artistName: "Rembrandt",
        artistSurname: "van Rijn",
        description: "A monumental Dutch Golden Age militia group portrait.",
        creationYear: "1642",
        medium: "Oil on canvas",
        width: 70,
        height: 84,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg/960px-The_Nightwatch_by_Rembrandt_-_Rijksmuseum.jpg"
    },
];

export default artworks;
