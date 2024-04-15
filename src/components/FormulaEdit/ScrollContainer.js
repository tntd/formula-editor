import 'intersection-observer';
import React, { useEffect } from 'react';
import './index.less';
import ReactDOM from 'react-dom';

import { getTypeMap } from './otp';

const firstItemClass = 'li-first',
  lastItemClass = 'li-last';
const ScrollContainer = (props) => {
  const { style, dropList, theme, selectChange, listLen, listSize, itemHeight, typeMap, lang, domId } = props;
  const halfListSize = Math.floor(listSize / 2);
  let box = null,
    intersectionObserver = null,
    lastRenderIndex = 0,
    currentIndex = 0,
    firstItem = null,
    lastItem = null,
    lastScrollTop = 0;

  const TYPE_MAP = getTypeMap(lang);

  useEffect(() => {
    window.currentIndex = currentIndex;
    if (listLen <= listSize) {
      debugger
      renderList(0, listLen);
      const container = document.getElementById(domId);
      listLen && container && container.children && container.children[0].classList.add('cm-active');
    } else {
      // 创建 intersectionObserver 对象
      intersectionObserver = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) return false;
          if (currentIndex && entry.target.classList.contains(firstItemClass)) {
            // console.log('向上滑动')
            handleScroll(false);
          } else if (entry.target.classList.contains(lastItemClass)) {
            // console.log('向下滑动')
            handleScroll(true);
          }
        }
      });
      initFirstItems();
      // 用户大幅度滚动时则使用scroll兼容方案
      polyScroll();
    }
    return () => {
      // console.log('清除')
      firstItem && intersectionObserver && intersectionObserver.unobserve(firstItem);
      lastItem && intersectionObserver && intersectionObserver.unobserve(lastItem);
      intersectionObserver && intersectionObserver.disconnect();
      init();
    };
  }, [dropList]);

  useEffect(() => {
    const container = document.getElementById(domId);
    container.addEventListener('click', (e) => {
      const value = e.target.getAttribute('data-value') || e.target.parentNode.getAttribute('data-value');
      const name = e.target.getAttribute('data-name') || e.target.parentNode.getAttribute('data-name');
      selectChange({ name, value });
    });
    return () => {
      container.removeEventListener('click', () => { });
    };
  }, []);

  const init = () => {
    const container = document.getElementById(domId);
    container.style.paddingTop = '0px';
    container.style.paddingBottom = '0px';
    box = null;
    intersectionObserver = null;
    lastRenderIndex = 0;
    currentIndex = 0;
    lastScrollTop = 0;
    firstItem = null;
    lastItem = null;
    document.querySelector('.scroll-container').scrollTop = 0;
  };

  const polyScroll = () => {
    const box = document.querySelector('.scroll-container');
    const boxHeight = box && box.offsetHeight;
    const baseHeight = itemHeight * halfListSize - itemHeight - boxHeight;
    box.onscroll = (e) => {
      const currentScrollTop = e.target.scrollTop;
      // 处理大幅向下滚动
      if (currentScrollTop - lastScrollTop >= itemHeight) {
        let firstIndex = Math.floor(Math.abs(currentScrollTop - baseHeight) / (itemHeight * halfListSize)) * halfListSize;
        const lastIndex = getContainerLastIndex();
        firstIndex = firstIndex > lastIndex ? lastIndex : firstIndex;
        if (firstIndex !== window.currentIndex) scrollCallback(firstIndex, true);
        lastScrollTop = currentScrollTop;
      }
      if (currentScrollTop - lastScrollTop <= -itemHeight) {
        let firstIndex = Math.floor((currentScrollTop - itemHeight) / (itemHeight * halfListSize)) * halfListSize;
        firstIndex = firstIndex <= 0 ? 0 : firstIndex;
        scrollCallback(firstIndex, false);
        lastScrollTop = currentScrollTop;
      }
    };
  };

  const initFirstItems = () => {
    renderList(0, listSize);
    adjustPaddings(0);
    setTimeout(() => {
      bindNewItems();
    }, 100);
  };

  const renderList = (firstIndex, listSize) => {
    const newTypeMap = { ...TYPE_MAP, ...typeMap };
    let currentList = JSON.parse(JSON.stringify(dropList));
    currentList = currentList.splice(firstIndex, listSize);
    const container = document.getElementById(domId);
    // container.style.display = 'none';
    const listItems = [];
    for (let i = 0; i < currentList.length; i++) {
      let item = currentList[i];
      const dataTypeObj = newTypeMap[item.type] ? newTypeMap[item.type] : '';
      let listItemContent;
      listItemContent = (
        <li key={i} className="cm-field-li" data-value={item.value} title={item.name} data={item.value} data-name={item.name}>
          {dataTypeObj && <sup style={{ color: dataTypeObj.color }}>{dataTypeObj.displayName}</sup>}
          {item.prefix}
          {item.name}
        </li>
      );

      listItems.push(listItemContent); // Push each list item component to the array
    }
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(null, container); //
    ReactDOM.render(listItems, container); //
    container.style.display = 'block';
  };

  const bindNewItems = (isScrollDown) => {
    const container = document.getElementById(domId);
    firstItem && intersectionObserver && intersectionObserver.unobserve(firstItem);
    lastItem && intersectionObserver && intersectionObserver.unobserve(lastItem);
    if (container && container.children && container.children.length) {
      container.children[0].classList.add(firstItemClass);
      //start-键盘移动添加active属性 上下移动位置不同
      let newInd = 0;
      if (isScrollDown && window.currentIndex) {
        newInd = (window.currentIndex / 10) % 2 > 0 ? 8 : 7;
      }
      if (isScrollDown === false) {
        newInd = (window.currentIndex / 10) % 2 > 0 ? 13 : 11;
      }
      container && container.children && container.children[newInd] && container.children[newInd].classList.add('cm-active');
      //-end
      container.children[container.children.length - 1].classList.add(lastItemClass);
      const newFirstItem = container.querySelector(`.${firstItemClass}`);
      const newLastItem = container.querySelector(`.${lastItemClass}`);
      intersectionObserver && intersectionObserver.observe(newFirstItem);
      intersectionObserver && intersectionObserver.observe(newLastItem);
      firstItem = newFirstItem;
      lastItem = newLastItem;
    }
  };

  const handleScroll = (isScrollDown) => {
    const firstIndex = getContainerFirstIndex(isScrollDown);
    scrollCallback(firstIndex, isScrollDown);
  };

  const getContainerFirstIndex = (isScrollDown) => {
    return isScrollDown ? currentIndex + halfListSize : currentIndex - halfListSize < 0 ? 0 : currentIndex - halfListSize;
  };

  const getContainerLastIndex = () => {
    const restListSize = listLen % listSize;
    let lastIndex;
    if (restListSize === 0) {
      lastIndex = listLen - listSize;
    } else {
      lastIndex = restListSize >= halfListSize ? listLen - restListSize : listLen - restListSize - halfListSize;
    }
    return lastIndex <= 0 ? 0 : lastIndex;
  };

  const scrollCallback = (firstIndex, isScrollDown) => {
    const lastIndex = getContainerLastIndex();
    if (isScrollDown) {
      if (firstIndex > lastIndex) return;
    } else {
      if (lastRenderIndex === firstIndex) return;
    }
    lastRenderIndex = firstIndex;
    if (firstIndex === lastIndex) {
      const lastListSize = listLen - lastIndex;
      renderList(lastIndex, lastListSize);
    } else {
      renderList(firstIndex, listSize);
    }
    currentIndex = firstIndex;
    window.currentIndex = currentIndex;
    bindNewItems(isScrollDown);
    adjustPaddings(firstIndex);
  };

  const adjustPaddings = (firstIndex) => {
    const container = document.getElementById(domId);
    const halfListSizeHeight = halfListSize * itemHeight;
    const totalPadding = ((listLen - listSize) / halfListSize) * halfListSizeHeight;
    const newCurrentPaddingTop = firstIndex <= 0 ? 0 : (firstIndex / halfListSize) * halfListSizeHeight;
    const newCurrentPaddingBottom = totalPadding - newCurrentPaddingTop < 0 ? 0 : totalPadding - newCurrentPaddingTop;
    container.style.paddingTop = `${newCurrentPaddingTop}px`;
    container.style.paddingBottom = `${newCurrentPaddingBottom}px`;
  };
  return (
    <div
      className={`codemirror-tip-${theme} scroll-container`}
      style={{
        ...style
      }}
      id="scrollDiv">
      <ul className="cm-field-ul box-ul" ref={(e) => (box = e)} id={domId} />
    </div>
  );
};

export default ScrollContainer;
