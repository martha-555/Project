/** @format */

const storage = document.querySelector(".storage-count");
const transfer = document.querySelector(".transfer-count");
const radio = document.querySelectorAll(".radio");
const radio_scaleway = document.querySelectorAll(".radio-scaleway");
const scale = document.querySelectorAll(".scale");
const storage_value = document.querySelector(".storage-value");
const transfer_value = document.querySelector(".transfer-value");
const price = document.querySelectorAll(".price");
const check_bunny = document.querySelector(".change-radio");
const check_scaleway = document.querySelector(".change-scaleway");

const radioHandler = (block) => {
  radio.forEach((item) => {
    const max_payment = 10;

    if (item.checked) {
      const storage_price = 0.01;
      let sum = getFormattedPrise(
        item.value * storage.value + storage_price * transfer.value
      );

      block.innerHTML =
        parseFloat(sum) <= max_payment ? sum : max_payment.toFixed(2) + "$";
    }
  });
};

const scalewayHandler = (block) => {
  radio_scaleway.forEach((item) => {
    if (item.checked) {
      const freeGB = 75;
      const transfer_price = 0.02;
      let sum_storage =
        storage.value > freeGB
          ? getFormattedPrise(item.value * (storage.value - freeGB))
          : 0;
      let sum_transfer =
        transfer.value > freeGB
          ? getFormattedPrise(transfer_price * (transfer.value - freeGB))
          : 0;

      sum = parseFloat(sum_storage) + parseFloat(sum_transfer);
      block.innerHTML = sum.toFixed(2) + " $";
    }
  });
};

const screen = window.matchMedia("(max-width:768px) ");
if (screen.matches) console.log(screen);

const increase_Width = (className, value) => {
  document.querySelector(className).style.width =
    parseFloat(value.innerHTML) * 5 + "px";
};

const countHandler = (range, scale_value) => {
  document.querySelector(
    ".storage-name"
  ).innerHTML = `Storage: ${storage.value} GB`;
  document.querySelector(
    ".transfer-name"
  ).innerHTML = `Transfer: ${transfer.value} GB`;

  range.innerHTML = scale_value;
  price.forEach((item) => {
    if (item.classList.contains("backblaze-price")) {
      const backblaze_storage_price = 0.005;
      const backblaze_transfer_price = 0.01;
      const min_payment = 7;

      let sum_backblaze = getFormattedPrise(
        backblaze_storage_price * storage.value +
          backblaze_transfer_price * transfer.value
      );

      item.innerHTML =
        parseFloat(sum_backblaze) >= min_payment
          ? sum_backblaze
          : min_payment.toFixed(2) + " $";

      increase_Width(".backblaze-scale", item);
    }
    if (item.classList.contains("bunny-price")) {
      radioHandler(item);
      increase_Width(".bunny-scale", item);
    }
    if (item.classList.contains("scaleway-price")) {
      scalewayHandler(item);
      increase_Width(".scaleway-scale", item);
    }
    if (item.classList.contains("vultr-price")) {
      const vultr_price = 0.01;
      const min_payment = 5;
      let sum_vultr = getFormattedPrise(
        (+storage.value + +transfer.value) * vultr_price
      );

      item.innerHTML =
        parseFloat(sum_vultr) >= min_payment
          ? sum_vultr
          : min_payment.toFixed(2) + " $";
      increase_Width(".vultr-scale", item);
    }
  });

  let widthArr = [];
  let min = 0;
  scale.forEach((item) => {
    widthArr.push(parseFloat(item.style.width));
  });
  min = Math.min(...widthArr);
  scale.forEach((item) => {
    item.style.background = "";
    if (parseFloat(item.style.width) == min)
      item.style.background = item.getAttribute("color");
  });
};

const getFormattedPrise = (value) => `${value.toFixed(2)} $`;

countHandler(storage_value, storage.value);
countHandler(transfer_value, transfer.value);

storage.oninput = () => countHandler(storage_value, storage.value);
transfer.oninput = () => countHandler(transfer_value, transfer.value);
check_bunny.onchange = () =>
  radioHandler(document.querySelector(".bunny-price"));
check_scaleway.onchange = () =>
  scalewayHandler(document.querySelector(".scaleway-price"));
