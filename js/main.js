window.addEventListener('DOMContentLoaded', ()=>{

const tabs=document.querySelectorAll('.tabheader__item'),
    tabsContent=document.querySelectorAll('.tabcontent'),
    tabsParent=document.querySelector('.tabheader__items');

function hideTabContent(){
        tabsContent.forEach(item=>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item=>{
            item.classList.remove('tabheader__item_active');
        });
    }

function showTabContent(i=0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    hideTabContent();
    showTabContent();

tabsParent.addEventListener('click', function(event){
        const target=event.target;

        if(target && target.classList.contains ('tabheader__item')){
            tabs.forEach((item, i)=>{
                if(target==item){
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    let deadline='2020-12-31';   

    function getTimeRemain(endtime){
        let t=Date.parse(endtime)-Date.parse(new Date()),
            days=Math.floor(t/(1000*60*60*24)),
            hours=Math.floor((t/(1000*60*60)%24)),
            min=Math.floor((t/1000/60)%60),
            sec=Math.floor((t/1000)%60);
        
            return{
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': min,
                'seconds': sec
            };
    }
    function getZero(num){
        if(num>=0 && num<10){
            return `0${num}`;
        }else {
            return num
        }
    }

    function setClock(selector, endtime){
        let timer= document.querySelector(selector),
        days=timer.querySelector('#days'),
        hours=timer.querySelector('#hours'),
        minutes=timer.querySelector('#minutes'),
        seconds=timer.querySelector('#seconds'),
        timeInterval=setInterval(updateClock, 1000);

    updateClock();

        function updateClock(){
            let t=getTimeRemain(endtime);

            days.innerHTML=getZero(t.days);
            hours.innerHTML=getZero(t.hours);
            minutes.innerHTML=getZero(t.minutes);
            seconds.innerHTML=getZero(t.seconds);

            if(t.total<=0){
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //Modal

    let modalTrigger=document.querySelectorAll('[data-modal]'),
        modal=document.querySelector('.modal');
        // modalClose=document.querySelector('[data-close]');

    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow='hidden';
        clearInterval(modalTimerId);
        };
    modalTrigger.forEach(btn => { btn.addEventListener('click', openModal);
    });

    function CloseModalWindow(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow='';
    };
    // modalClose.addEventListener('click', CloseModalWindow);
   
    modal.addEventListener('click', (e)=>{
        if(e.target===modal || e.target.getAttribute('data-close')==''){
            CloseModalWindow();
        }
    });
    document.addEventListener('keydown', (e)=>{
        if(e.code==="Escape"&& modal.classList.contains('show')) {
            CloseModalWindow();
        }
    });

    let modalTimerId=setTimeout(openModal, 90000); 

    function showModalByScroll(){
        if(window.pageYOffset+document.documentElement.clientHeight >=document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

//Классы для карточек

class MenuCard {
     constructor(src, alt, title, desciption, price, parentSelector, ...classes){
        this.srs=src;
        this.alt=alt;
        this.title=title;
        this.desciption=desciption;
        this.price=price;
        this.classes=classes;
        this.parent=document.querySelector(parentSelector);
        this.transfer=35;
        this.changetoRUB();
     }
     changetoRUB(){
         this.price=+this.price*this.transfer;
     }

     render(){
         let element=document.createElement('div');
            if (this.classes.length===0){
                this.element='menu__item';
                element.classList.add(this.element);
            }else{
                this.classes.forEach(className=>element.classList.add(className));
            }

         element.innerHTML=`
                <img src=${this.srs} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.desciption}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
         `;
        this.parent.append(element);
     }
}
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        23,
        '.menu .container',

    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню Премиум"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        45,
        '.menu .container',
        

    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        32,
        '.menu .container',
    ).render();

    //Forms

    let form=document.querySelectorAll('form');

    let message={
        loading: 'icons/spinner.svg',
        success: 'Спасибо, Ваша заявка получена, скоро мы с Вами свяжемся!',
        failure: 'Ошибка! Попробуйте еще раз или свяжитесь с администратором при повторении данной ошибки'
    };

    form.forEach(item=>{
        postData(item);

    });

    function postData(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            let statusMessage=document.createElement('img');
            statusMessage.src=message.loading;
            statusMessage.style.cssText=`
            display: block;
            margin: 0 auto;

            `;
            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);

            let request =new XMLHttpRequest();
            request.open('POST','server.php');
            
            request.setRequestHeader('Content-type', 'application/json');
            let formData=new FormData(form);

            let obj={};
            formData.forEach(function(value, key){
                obj[key]=value;
            });

            const json=JSON.stringify(obj);

            request.send(json);

            request.addEventListener('load', ()=>{
                if(request.status===200){
                    console.log(request.response);
                    showThanks(message.success);
                    form.reset();
                        statusMessage.remove();
                }else{
                    showThanks(message.failure);
                }
            });
            
        });
    }

    function showThanks(message){
        const prevModalDialog=document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksMod=document.createElement('div');
        thanksMod.classList.add('modal__dialog');
        thanksMod.innerHTML=`
        <div class="modal__content">
            <div data-close class="modal__close">&times;</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        document.querySelector('.modal').append(thanksMod);
        setTimeout( ()=>{
            thanksMod.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            CloseModalWindow();

        },4000);


    }
});