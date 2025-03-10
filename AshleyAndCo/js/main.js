window.addEventListener("DOMContentLoaded", () => {
    // Функция для установки background-image из src картинки внутри .ibg
    function ibg() {
        let ibg = document.querySelectorAll(".ibg");
        for (let i = 0; i < ibg.length; i++) {
            let img = ibg[i].querySelector("img");
            if (img) {
                ibg[i].style.backgroundImage = `url(${img.getAttribute("src")})`;
            }
        }
    }

    ibg(); // Вызываем функцию, чтобы обработать все .ibg элементы

    const iconMenu = document.querySelector(".menu__icon");
    const menuBody = document.querySelector(".menu__body");
    const menuList = document.querySelector(".menu__list");

    // Функция для закрытия меню
    function closeMenu() {
        document.body.classList.remove("_lock"); // Убираем блокировку скролла страницы
        iconMenu.classList.remove("_active"); // Убираем активный класс с иконки меню
        menuBody.classList.remove("_active"); // Убираем активный класс с самого меню
        menuList.classList.remove("_menu-anime"); // Убираем класс анимации
    }

    if (iconMenu) {
        // Открытие/закрытие меню по клику на иконку
        iconMenu.addEventListener("click", function () {
            document.body.classList.toggle("_lock"); // Блокируем/разблокируем скролл
            iconMenu.classList.toggle("_active"); // Переключаем активный класс иконки
            menuBody.classList.toggle("_active"); // Переключаем активный класс меню

            // Добавляем задержку для анимации пунктов меню
            if (menuBody.classList.contains("_active")) {
                setTimeout(() => {
                    menuList.classList.add("_menu-anime"); // Добавляем класс анимации
                }, 300); // Задержка 300 мс
            } else {
                menuList.classList.remove("_menu-anime"); // Убираем класс анимации
            }
        });

        // Закрытие меню при клике вне его области
        document.addEventListener("click", function (e) {
            if (
                menuBody.classList.contains("_active") && // Проверяем, открыто ли меню
                !menuBody.contains(e.target) && // Клик не по самому меню
                !iconMenu.contains(e.target) // Клик не по иконке меню
            ) {
                closeMenu(); // Закрываем меню
            }
        });

        // Закрытие меню при скролле к новой секции
        const sections = document.querySelectorAll("section"); // Находим все секции
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && menuBody.classList.contains("_active")) {
                        closeMenu(); // Закрываем меню при появлении новой секции в области видимости
                    }
                });
            },
            { threshold: 0.3 } // Секция считается видимой, если 50% её высоты в области видимости
        );

        sections.forEach((section) => observer.observe(section)); // Отслеживаем все секции
    }

    const menuLinks = document.querySelectorAll(".menu__item[data-goto]");

    if (menuLinks.length > 0) {
        menuLinks.forEach((menuLink) => {
            menuLink.addEventListener("click", onMenuLinkClick);
        });

        // Функция для плавного перехода к нужному блоку при клике на ссылку меню
        function onMenuLinkClick(e) {
            const menuLink = e.target;
            if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
                const gotoBlock = document.querySelector(menuLink.dataset.goto); // Находим нужный блок
                const gotoBlockValue =
                    gotoBlock.getBoundingClientRect().top + // Расстояние до блока относительно окна
                    pageYOffset - // Текущий скролл страницы
                    document.querySelector("header").offsetHeight; // Учитываем высоту хедера

                if (iconMenu.classList.contains("_active")) { // Если меню открыто
                    closeMenu(); // Закрываем меню
                }

                window.scrollTo({
                    top: gotoBlockValue, // Скроллим к нужному блоку
                    behavior: "smooth", // Делаем плавную прокрутку
                });
                e.preventDefault(); // Отменяем стандартное поведение ссылки
            }
        }
    }

    const animItems = document.querySelectorAll('._anim-items:not(.menu__list > li)'); // Исключаем пункты меню

    if (animItems.length > 0) {
        window.addEventListener('scroll', animOnScroll);
        function animOnScroll() {
            for (let index = 0; index < animItems.length; index++) {
                const animItem = animItems[index];
                const animItemHeight = animItem.offsetHeight;
                const animItemOffset = offset(animItem).top;
                const animStart = 4;

                let animItemPoint = window.innerHeight - animItemHeight / animStart;
                if (animItemHeight > window.innerHeight) {
                    animItemPoint = window.innerHeight - window.innerHeight / animStart;
                }

                if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
                    animItem.classList.add('_anime');
                } else {
                    if (!animItem.classList.contains('_anim-no-hide')) {
                        animItem.classList.remove('_anime');
                    }
                }
            }
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
        }

        setTimeout(() => {
            animOnScroll();
        }, 300);
    }
});