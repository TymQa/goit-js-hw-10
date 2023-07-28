import axios from "axios";
import { fetchBreeds, fetchCatByBreed } from "./cat-api";
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

axios.defaults.headers.common["x-api-key"] = "live_2EctFCC8aXc3rvxJIAmZSyZRhU1PHpMoR9O9u77qDY6TlwhjD8nU6bBtTsIpmbPH";

const selectCat = document.querySelector(".breed-select");
const catInfo = document.querySelector(".cat-info");
const loaderContainer = document.querySelector('.loader-container');
const loaderText = document.querySelector(".loader-text");
const error = document.querySelector('.error');

selectCat.addEventListener("change", onSelectChange);

function createCatList() {
    // Показываем лоадер перед началом запроса
    loaderContainer.classList.add('visible');
    selectCat.classList.add("is-hidden");
    error.classList.add("is-hidden");

    // Обрабатываем результат запроса на бекенд (все породы котов)
    fetchBreeds()
        .then(data => {
            const optionsList = data
                .map(({ id, name }) => `<option value="${id}">${name}</option>`)
                .join("");

            selectCat.innerHTML = optionsList;

            // Инициализируем SlimSelect для стилизации выпадающего списка
            new SlimSelect({
                select: selectCat
            });

            // Скрываем лоадер и показываем селект
            loaderContainer.classList.remove('visible');
            selectCat.classList.remove("is-hidden");
        })
        .catch(error => {
            // Если произошла ошибка, скрываем лоадер и показываем сообщение об ошибке
            loaderContainer.classList.remove('visible');
            Notify.failure("Oops! Something went wrong! Try reloading the page!");
        });
}

// Вызываем функцию создания списка пород котов при необходимости

createCatList();

function onSelectChange(evt) {
    loaderContainer.classList.add('visible');
    catInfo.classList.add('is-hidden');

    const selectedBreedId = evt.currentTarget.value;

    fetchCatByBreed(selectedBreedId)
        .then(data => {
            renderMarkupInfo(data);
            loaderContainer.classList.remove('visible');
            catInfo.classList.remove('is-hidden');
        })
        .catch(error => {
            loaderContainer.classList.remove('visible');
            Notify.failure('Oops! Something went wrong! Try reloading the page!');
        });
}

function renderMarkupInfo(data) {
    const { breeds, url } = data[0];
    const { name, temperament, description } = breeds[0];
    const beerdCard = `<img class="pfoto-cat" width="300px" src="${url}" alt="${name}">
    <div class="text-part">
        <h2 class="name-cat">${name}</h2>
        <p class="deskr-cat">${description}</p>
        <p class="temperament-cat"><span class="temperament-label">Temperament:</span> ${temperament}</p>
    </div>`;

    catInfo.innerHTML = beerdCard;
}
