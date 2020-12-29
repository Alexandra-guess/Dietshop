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
    const getResource =async (url)=>{
        const res= await fetch(url);
        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await  res.json();
};
    getResource('http://localhost:3000/menu')
        .then(data=>{
            data.forEach((
                {img, altimg, title, descr, price}) => 
                {new MenuCard(img, altimg, title, descr, price, '.menu .container')
                .render();
            });
        });

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

    const fetchPostData =async (url, data)=>{
        const res= await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: data
        });

        return await  res.json();
    };

    function postData(form){
        form.addEventListener('submit', (e)=>{
            e.preventDefault();

            let statusMessage=document.createElement('img');
            statusMessage.src=message.loading;
            statusMessage.style.cssText=`
            display: block;
            margin: 0 auto;
            `;
            
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData=new FormData(form);
            const json =JSON.stringify(Object.fromEntries(formData.entries()));

            // const obj={};
            // formData.forEach(function(value, key){
            //     obj[key]=value;
            // });
            // fetch('server.php',{         //Старый код с использованием fetch вместо функции fetchPostData
            //     method: 'POST',
            //     headers: {
            //         'Content-type': 'application/json'
            //     },
            //     body: JSON.stringify(obj)
            // })

            fetchPostData('http://localhost:3000/requests', json )

            .then(data =>{
                    console.log(data);
                    showThanks(message.success);
                    statusMessage.remove();
            }).catch(()=>{
                    showThanks(message.failure);
            }).finally(()=>{
                    form.reset();
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
    
    fetch('http://localhost:3000/menu')
    .then(data=>data.json())
    .then(res=>console.log(res));

    //Slider

    // const slides= document.querySelectorAll('.offer__slide'),
    //         prev=document.querySelector('.offer__slider-prev'),
    //         next=document.querySelector('.offer__slider-next'),
    //         total=document.querySelector('#total'),
    //         current=document.querySelector('#current');    
    // let slideIndex=1;

    // showSlide(slideIndex);

    // if(slides.length<10){
    //     total.textContent=`0${slides.length}`;
    //     } else{
    //         total.textContent=slides.length;
    //     }

    // function showSlide(n){
    //     if( n> slides.length){
    //         slideIndex=1;
    //     }
    //     if(n<1){
    //         slideIndex=slides.length;
    //     }
    //     slides.forEach(item=> item.style.display='none');
    //     slides[slideIndex-1].style.display='block';

    //     if(slides.length<10){
    //         current.textContent=`0${slideIndex}`;
    //         } else{
    //             current.textContent=slideIndex;
    //         }
    // }

    // function plusSlider(n){
    //     showSlide(slideIndex+=n);
    // }

    // prev.addEventListener('click', ()=>{
    //     plusSlider(-1);
    // });
    // next.addEventListener('click', ()=>{
    //     plusSlider(1);
    // });

//slider ver 2

const slides= document.querySelectorAll('.offer__slide'),
            prev=document.querySelector('.offer__slider-prev'),
            next=document.querySelector('.offer__slider-next'),
            total=document.querySelector('#total'),
            current=document.querySelector('#current'),
            slidesWrapper=document.querySelector('.offer__slider-wrapper'),
            slidesInner=document.querySelector('.offer__slider_inner'),
            width=window.getComputedStyle(slidesWrapper).width;

    let slideIndex=1;
    let offset=0;

     if(slides.length<10){                      //Нумерация
        total.textContent=`0${slides.length}`;
        current.textContent=`0${slideIndex}`;
        } else{
            total.textContent=slides.length;
            current.textContent=slideIndex;

        }

    slidesInner.style.width=100*slides.length+ '%';
    slidesInner.style.display='flex';
    slidesInner.style.transition='0.5s all';
    slidesWrapper.style.overflow='hidden';

    next.addEventListener('click',()=>{
        if(offset== +width.slice(0, width.length-2)*(slides.length-1)){
            offset=0;
        }else{
            offset+= +width.slice(0, width.length-2);
        }

        slidesInner.style.transform=`translateX(-${offset}px)`;

        if(slideIndex==slides.length){
            slideIndex=1;
        }else{
            slideIndex++;
        }

        if(slides.length<10){
            current.textContent=`0${slideIndex}`;
        }else{
            current.textContent=slideIndex;
        }

    });

    prev.addEventListener('click',()=>{
        if(offset==0){
            offset= +width.slice(0, width.length-2)*(slides.length-1);
        }else{
            offset-=width.slice(0, width.length-2);
        }

        slidesInner.style.transform=`translateX(-${offset}px)`;

        if(slideIndex==1){
            slideIndex=slides.length;
        }else{
            slideIndex--;
        }

        if(slides.length<10){
            current.textContent=`0${slideIndex}`;
        }else{
            current.textContent=slideIndex;
        }
    });

    slides.forEach(slide=>{
        slide.style.width=width;
    });
     



});