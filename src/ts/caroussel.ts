import { delay } from "./utils";

/*create caroussel elements*/

function createImageContainer(container: HTMLDivElement): HTMLDivElement{
    let imgContainer = document.createElement("div") as HTMLDivElement;
    imgContainer.classList.add("img-container");
    container.appendChild(imgContainer);
    return imgContainer;
}

function createSliderContainer(container: HTMLDivElement): HTMLDivElement{
    let sliderContainer = document.createElement("div") as HTMLDivElement;
    sliderContainer.classList.add("slider-container");
    container.appendChild(sliderContainer);
    return sliderContainer;
}

function addImageToImageContainer(imgContainer: HTMLDivElement,imgSrcList: string[], srcIndex:number) {
    let img = document.createElement("img") as HTMLImageElement;
    img.classList.add("caroussel-img")
    if(srcIndex == 0) {
        img.classList.add("active");
    }
    img.setAttribute("src",imgSrcList[srcIndex]); 
    img.setAttribute("img-index",srcIndex.toString());
    imgContainer.appendChild(img);
}

function addDotAndSliderToSliderContainer(sliderContainer:HTMLDivElement,imgSrcList: string[], srcIndex:number){
    let dot = document.createElement("span") as HTMLSpanElement;
    dot.classList.add("caroussel-dot");
    if(srcIndex == 0) {
        dot.classList.add("active");
    }
    dot.setAttribute("dot-index",srcIndex.toString());
    sliderContainer.appendChild(dot);
    if(srcIndex<imgSrcList.length-1) {
        let slider = document.createElement("span") as HTMLSpanElement;
        slider.classList.add("caroussel-slider");
        sliderContainer.appendChild(slider);
    }
}

function createCarousselElement(container: HTMLDivElement, imgSrcList: string[]) {
    let imgContainer = createImageContainer(container);
    let sliderContainer = createSliderContainer(container);

    for(let srcIndex: number = 0;srcIndex<imgSrcList.length;srcIndex++) {
        addImageToImageContainer(imgContainer,imgSrcList,srcIndex);
        addDotAndSliderToSliderContainer(sliderContainer,imgSrcList,srcIndex);
    }
}

/* Set transition */

function createTranslationXList(containerWidth: number, numberOfImg: number): number[] {
    let translationXList: number[] = [];
    for(let i: number = 0; i<numberOfImg; i++){
            translationXList.push(-i*containerWidth);
    }
    return translationXList;
}

function setImgTransition(containerWidth: number, indexWeight: number, delayInMs:number, targetImgIndex: number, activeImgIndex: number) {
    let imgCollection = document.getElementsByClassName("caroussel-img") as HTMLCollection;
    const translationX: number[] = createTranslationXList(containerWidth,imgCollection.length);
    let imgContainer = imgCollection.item(0)?.parentElement as HTMLDivElement;
    imgContainer.style.transitionDuration = (Math.abs(activeImgIndex-targetImgIndex)*(indexWeight*delayInMs/1000)).toString() + "s";
    imgContainer.style.transform = "translateX(" + (translationX[targetImgIndex]).toString() + "px)";
    imgCollection[activeImgIndex].classList.remove("active");
    imgCollection[targetImgIndex].classList.add("active");
}

async function transitionToTheRight(indexWeight: number, delayInMs:number, targetImgIndex: number, activeImgIndex: number,sliderElementCollection: HTMLCollection) {
    for (let sliderElementIndex:number = activeImgIndex*indexWeight + 1; sliderElementIndex<targetImgIndex*indexWeight + 1; sliderElementIndex++) {
        (sliderElementCollection[sliderElementIndex]as HTMLSpanElement).style.transitionDuration = (delayInMs/1000).toString() + "s"
        sliderElementCollection[sliderElementIndex].classList.add("active");
        await delay(delayInMs);
    }
}

async function transitionToTheLeft(indexWeight: number, delayInMs:number, targetImgIndex: number, activeImgIndex: number,sliderElementCollection: HTMLCollection) {
    for (let sliderElementIndex:number = activeImgIndex*indexWeight; targetImgIndex*indexWeight<sliderElementIndex; sliderElementIndex--) {
        (sliderElementCollection[sliderElementIndex]as HTMLSpanElement).style.transitionDuration = (delayInMs/1000).toString() + "s"
        sliderElementCollection[sliderElementIndex].classList.remove("active");
        await delay(delayInMs);
    }
}

function setSliderTransition(indexWeight: number, delayInMs:number, targetImgIndex: number, activeImgIndex: number, target: HTMLSpanElement) {
    let sliderElementCollection = target.parentElement?.children as HTMLCollection;
    if(targetImgIndex<activeImgIndex){
        transitionToTheLeft(indexWeight,delayInMs,targetImgIndex,activeImgIndex,sliderElementCollection);
    } else if (targetImgIndex>activeImgIndex) {
        transitionToTheRight(indexWeight,delayInMs,targetImgIndex,activeImgIndex,sliderElementCollection);
    }
}

function setTransition(containerWidth: number, indexWeight: number, delayInMs:number, target: HTMLSpanElement) {
    let activeImgIndex: number = Number((document.querySelector(".caroussel-img.active") as HTMLImageElement).getAttribute("img-index"));
    let targetImgIndex: number = Number(target.getAttribute("dot-index"));
    if(targetImgIndex!=activeImgIndex){
        setImgTransition(containerWidth, indexWeight,delayInMs,targetImgIndex,activeImgIndex);
        setSliderTransition(indexWeight,delayInMs,targetImgIndex,activeImgIndex,target);
    }
}


function carousselTransition(event: Event, delayInMs: number, containerWidth: number) {
    const indexWeight: number = 2; //to match dot index with span index within the caroussel div
    let target = event.target as HTMLSpanElement;

    setTransition(containerWidth, indexWeight, delayInMs, target);
}

/*create caroussel*/

export function createCaroussel(carousselContainer: HTMLDivElement, imgSrcList: string[], delayInMs: number, containerWidth: number) {
    carousselContainer.style.width = containerWidth.toString() + "px";
    createCarousselElement(carousselContainer,imgSrcList); 

    let carousselDots = document.getElementsByClassName("caroussel-dot") as HTMLCollection; //setting transition on dot clicking
    for (let dotIndex: number = 0; dotIndex < carousselDots.length; dotIndex++) {
        let dot = carousselDots[dotIndex] as HTMLSpanElement;
        dot.addEventListener("click", (e: Event) =>{
        carousselTransition(e,delayInMs,containerWidth);
        });
    }
}