import familyHeteroIcon from "./assets/img/familyHetero.svg";
import familyWomen from "./assets/img/familyWomen.svg";
import familyMen from "./assets/img/familyMen.svg";
import "./css/caroussel";
import { createCaroussel } from "./ts/caroussel";

const imgSrc: string[] = [familyHeteroIcon,familyMen,familyWomen];
const pxWidth: number = 450; //with of images of the caroussel. Make sure to have images with same size
const delayInMs: number = 400; //duration of image transition to the left or right. Will be divised by two for the slider because we need the image transition and slider filling moving together

let carousselContainer = document.querySelector(".caroussel-container") as HTMLDivElement;
createCaroussel(carousselContainer, imgSrc,delayInMs,pxWidth);