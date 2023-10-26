
/**
 * 创建元素
 */
export const createElement = (css, text) => {
  let dom = document.createElement("div");
  dom.className = css || "";
  dom.innerHTML = text || "";
  return dom;
}
// 获取元素dom
var createdElements = {};
function getElement(id) {
  if (!createdElements[id]) {
    createdElements[id] = createElement();
    createdElements[id].id = "card-" + id;
  }
  return createdElements[id];
}

// 添加类名和属性
export const addClassesAndStyles = (element, isBold, showTable) => {
  if (isBold) {
    element.classList.add("element", "lightitem");
    if (showTable) {
      element.classList.add("highlight");
    }
  } else {
    element.className = "element";
    element.style.cssText =
      "background-repeat: no-repeat; " +
      "background-size: 100% 120%; " +
      "background-position: center center; " +
      "background-color: rgba(0,127,127," +
      (Math.random() * 0.7 + 0.25) +
      ")";
  }
}

// 创建标题logo和公司标识
export const createImageAndTextContainer = (imageSrc) => {
  var imageStyle = `
    width: 100%;
    height: 20px;
    object-fit: contain;
  `;

  return `
    <div class="image-text-container">
      <img src="${imageSrc}" style="${imageStyle}">
    </div>
  `;
}
export const  getCardHTML = (user, basicData) => {
  const cardConfigStyle = basicData.cardConfigStyle;
  // var companyContainerHTML = createImageAndTextContainer("http://172.90.0.10/_nuxt/img/logo.acb8f74.png");
  var companyElementHTML = `
    <div 
      class="company"
      style="
        top: ${cardConfigStyle.companyTop}px;
        font-size: ${cardConfigStyle.companyFontSize}px;
      ">
      <div class="image-text-container">
        <img 
          src="http://172.90.0.10/_nuxt/img/logo.acb8f74.png" 
          style="width: 100%;
          height: 20px;
          object-fit: contain;">
      </div>
    </div>`;
  var avatarElementHTML = `<div 
          class="avatar"
          style="height: 100%;
          display: flex;
          position: relative;
          justify-content: center;
          align-items: center;
          z-index: -1">
          <div style="width: 100%;height: 100%;background-color: rgba(0,0,0,0.1);position: absolute;top: 0;left:0;"></div>
      </div>`;
  var nameElementHTML = `
    <div 
      style="
        top: ${cardConfigStyle.nameTop};
        font-size: ${cardConfigStyle.nameFontSize}px; 
      "
      class="name">${user[2]}</div>`;
  
  var detailsElementHTML = `
      <div 
        style="
          bottom: ${cardConfigStyle.detailsBottom};
          font-size: ${cardConfigStyle.detailsFontsize}px;
        "
        class="details">
          <span style="display: none" class="cardIdTxt" id="card-${user[0]}">${user[0]}</span>
          <br/>
          <span id="user-dept">${user[1]}</span>
      </div>`;

  var cardHTML = `
    ${companyElementHTML}
    ${avatarElementHTML}
    ${nameElementHTML}
    ${detailsElementHTML}
  `;
  return cardHTML
}

export const getCardWithParentHtml = (user, isBold, id, showTable, row_column, basicData) => {
  let elementClassName = '';
  let elementCss = '';
  const cardConfigStyle = basicData.cardConfigStyle;
  if (isBold) {
    elementClassName = "element lightitem";
    if (showTable) {
      elementClassName += ' highlight';
    }
  } else {
    elementClassName = "element";
    elementCss = "background-repeat: no-repeat; " +
      "background-size: 100% 120%; " +
      "background-position: center center; " +
      "background-color: rgba(0,127,127," +
      (Math.random() * 0.7 + 0.25) +
      ");";
  }

  elementCss += `
    width: ${cardConfigStyle.cardWidth};
    height: ${cardConfigStyle.cardHeight};
  `
  return `
    <div id="${"card-" + id}" class="${elementClassName}" style="${elementCss}">
       ${getCardHTML(user, basicData)} 
    </div>
  `
}

export const createCard = (user, isBold, id, showTable, row_column) => {
  var element = getElement(id);
  addClassesAndStyles(element, isBold, showTable, row_column);
  element.innerHTML = getCardHTML(user);

  return element;
}