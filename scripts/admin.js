const router = new Navigo(null, true, '#!');
const app = document.getElementById('app');


let total;
db.ref('app/manager').on('value', s=>{
  $('.sp').hide();
total = s.val().total;
})

//form date
function dateForm(date){
  let d = date.split(' ');
  return d[2]+' '+d[1] + ' ' + d[3] 
}

//form time
function timeForm(date) {
  let d = date.split(' ')[4];
   d = d.split(':');
  let time = parseInt(d[0]) > 12 ? (parseInt(d[0])-12)+':'+d[1]+'PM' : parseInt(d[0])+':'+d[1]+'AM';
   return time;
}

router.on({
    '/': function() {
      $('.top-title').html(`My Manager(Admin)`);
      $('.footer').show();
      $('.footertext').hide();
      $('.footerIcon').removeClass('footerIconActive');
      if($('.hm')[0].classList[3] === undefined){
        $('.hm').addClass('footerIconActive');
        $($($('.hm')[0].parentNode)[0].lastElementChild).show();
      }

      app.innerHTML = `
      <div class="body">
      
      <div id="member_details_m"></div>
      <div class="total_stats_m"></div>
      </div>

      <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Deposits</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Deducts</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
      <div class="deposit_history_m"></div>
      </div>
      <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
      <div class="deduct_history_m"></div>
      </div>
    </div>


      <div class="modal fade" id="deduct_modal_m" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Member</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="add_deduct_m">
  
            <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Amount</span>
            <input type="number" name="amount" class="form-control" placeholder="Amount" aria-label="Username" aria-describedby="basic-addon1">
            </div>
  
            <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Perpose</span>
            <input type="text" name="status" class="form-control" placeholder="Status" aria-label="Username" aria-describedby="basic-addon1">
            </div>
    
            
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" id="deduct_button" class="btn btn-danger">-Deduct</button>
          </div>
        </div>
      </div>
    </div>
      `
      let amount;
      const deduct_history_m = document.querySelector('.deduct_history_m');
      db.ref('app/manager/').on('value', snap=>{
        let data = snap.val();
        
        amount = data.amount;
        $('#member_details_m').html(`
        <div class="m_d_amount">
        </div>
        <div class="m_d_name">Manager</div>
        <br>
        <center>
        <button id="deposit" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#deposit_modal_m">+Deposit</button>
        <button id="deposit" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deduct_modal_m">-Deduct</button>

        </center>
        `);

      

      //deposits
      let total_deposit = 0;
      if(data.deposits){
        const deposit_history_m = document.querySelector('.deposit_history_m');
        deposit_history_m.innerHTML = ``;
        let deposits = Object.entries(data.deposits)
        deposits.sort(function(a, b){
          return new Date(b[1].date) - new Date(a[1].date);
         })


   

     for(let i=0; i<deposits.length; i++){
      total_deposit += deposits[i][1].amount;
      deposit_history_m.innerHTML += `
     <div class="dd">
     <div class="dd_status">
     <div class="dd_text">${deposits[i][1].name}</div>
     <div class="dd_date">${dateForm(deposits[i][1].date)} ${timeForm(deposits[i][1].date)}</div>
     </div>

     <div class="dd_amount">${deposits[i][1].amount} <i class="icofont-taka-plus"></i></div>
     </div>
     `
     }

      }
      let total_deduct = 0;
    //   let regular = 0;
    // let guest = 0;
    // let half = 0;
    // let khala = 0;
    if(data.deducts){

      deduct_history_m.innerHTML = ``;
     let deducts = Object.entries(data.deducts)
     deducts.sort(function(a, b){
      return new Date(b[1].date) - new Date(a[1].date);
     })

    
  
     for(let i=0; i<deducts.length; i++){
      total_deduct += deducts[i][1].amount;
      // if(deducts[i][1].status === 'Regular Meal Charge') regular++;
      // if(deducts[i][1].status === 'Guest Meal Charge') guest++;
      // if(deducts[i][1].status === 'Half Meal Charge') half++;
      // if(deducts[i][1].status === 'Khala'){
      //   khala = deducts[i][1].amount;
      // }
    if(deducts[i][1].status =='Extra in feast' || deducts[i][1].status == 'Mosque' || deducts[i][1].status == 'Khala Bill'  || deducts[i][1].status == 'Extra in bazaar' || deducts[i][1].status == 'Extra'){
    if(deducts[i][1].name){
      deduct_history_m.innerHTML += `
     <div class="dd">
     <div class="dd_status">
     <div class="dd_text">${deducts[i][1].name}</div>
     <div class="dd_date" style="color: orange;">${deducts[i][1].status}</div>
     <div class="dd_date">${dateForm(deducts[i][1].date)} ${timeForm(deducts[i][1].date)}</div>
     </div>

     <div class="dd_amount">${deducts[i][1].amount} <i class="icofont-taka-minus"></i></div>
     </div>
     `
     }else{
      deduct_history_m.innerHTML += `
     <div class="dd">
     <div class="dd_status">
     <div class="dd_text">${deducts[i][1].status}</div>
     <div class="dd_date">${dateForm(deducts[i][1].date)} ${timeForm(deducts[i][1].date)}</div>
     </div>

     <div class="dd_amount">${deducts[i][1].amount} <i class="icofont-taka-minus"></i></div>
     </div>
     `
     }
    }

  }



    }

     $('.total_stats_m').html(`
     <div style="background: green; color: #eee;" class="stat">
     <div class="stat-count">${total_deposit}</div>
     <div class="stat-text">Total Dep.</div>
     </div>

     <div style="background: crimson; color: #eee;" class="stat">
     <div class="stat-count">${total_deduct}</div>
     <div class="stat-text">Total Ded.</div>
     </div>
     
     `)

     $('.m_d_amount').html(`${total_deposit-total_deduct}`)

    //  $('.stats').html(`
     

    //  <div class="stat">
    // <div class="stat-count">${regular}x25 = ${regular*25}</div>
    // <div class="stat-text">Meal</div>
    // </div>

    // <div class="stat">
    // <div class="stat-count">${half}x15 = ${half*15}</div>
    // <div class="stat-text">Half</div>
    // </div>

    // <div class="stat">
    // <div class="stat-count">${guest}x30 = ${guest*30}</div>
    // <div class="stat-text">Guest</div>
    // </div>

    // <div class="stat">
    // <div class="stat-count">${khala}</div>
    // <div class="stat-text">Khala</div>
    // </div>
    //  `)
      if(data.dailyMeal[getDateId()]){

    
      let todayMeal = data.dailyMeal[getDateId()];
      todayMeal = Object.entries(todayMeal);
      let meals = [];
      let bazaarCount = 0;
      let half = 0;
      for(let i=0; i<todayMeal.length; i++){
        bazaarCount += todayMeal[i][1].amount;
        console.log(todayMeal[i][1].amount)

        // if(todayMeal[i][1].status === 'Half Meal Charge')
        meals.push({
          name: todayMeal[i][1].name,
          status: todayMeal[i][1].status,
          amount: todayMeal[i][1].amount,
          id: todayMeal[i][0],
          date: todayMeal[i][1].date
        })
      }
    deduct_history_m.innerHTML += `<center><hr></center>`
    deduct_history_m.innerHTML += `
     <div class="dd">
     <div class="dd_status">
     <div class="dd_text">Bazaar Today(${todayMeal.length})</div>
     <div class="dd_date">${dateForm((new Date()).toString())}</div>
     </div>

     <div class="dd_amount">${bazaarCount} <i class="icofont-taka-minus"></i></div>
     </div>
     `
    }

      // console.log(meals);

      });
  
    //deposit
    // $('#deposit_button').click(function(){
    //   const add_deposit = document.getElementById('add_deposit');
    //   console.log(total);
    //   db.ref('app/members/'+params.id+"/deposits").push({
    //     amount: parseInt(add_deposit.amount.value),
    //     date: (new Date()).toString()
    //   });
    //   db.ref('app/members/'+params.id).update({
    //     amount: amount+parseInt(add_deposit.amount.value),
    //   });
    //   db.ref('app/manager').update({
    //     total: total+parseInt(add_deposit.amount.value)
    //   })
    // })

    //deduct 
    $('#deduct_button').click(function(){
      const add_deduct_m = document.getElementById('add_deduct_m');
      // console.log(total);
      db.ref('app/manager/deducts').push({
        amount: parseInt(add_deduct_m.amount.value),
        date: (new Date()).toString(),
        status: add_deduct_m.status.value
      });
     
      db.ref('app/manager').update({
        total: total-parseInt(add_deduct_m.amount.value)
      })
    });
    

      
    },

    "/members": function(){
      $('.top-title').html(`Members`);
      $('.footer').show();
      $('.footertext').hide();
        $('.footerIcon').removeClass('footerIconActive');
            if($('.mem')[0].classList[3] === undefined){
        $('.mem').addClass('footerIconActive');
        $($($('.mem')[0].parentNode)[0].lastElementChild).show();
        //$('.top_logo').html(`<div onclick="window.history.back()" class="top_app_title"><div class="animate__animated animate__fadeIn top_dir"><img src="../images/pencil-case.png" height="30px"></div> <div class="animate__animated animate__fadeIn top_text">Resources</div></div>`);
        }
      app.innerHTML = `
      <div class="body">
      
     <div id="members_list"></div>



      
      </div>


      <br>

<center>
<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add_m">
  Add+
</button>
</center>
     

        <!-- Modal -->
        <div class="modal fade" id="add_m" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Member</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="add_member">
                
                <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Name</span>
                <input type="text" name="username" class="form-control" placeholder="Member Name" aria-label="Username" aria-describedby="basic-addon1">
                </div>

                

                
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="add_m_button" class="btn btn-primary">Add</button>
              </div>
            </div>
          </div>
        </div>


      `

      const add_member = document.getElementById('add_member');

      $('#add_m_button').click(function(){
        let data = {
          name: add_member.username.value,
          amount: 0
        }

        // console.log(data);
        db.ref('app/members').push(data);
        $('#add_m').modal('hide');
      })

      const members_list = document.getElementById('members_list');
      db.ref('app/members').on('value', snap=>{     
        members_list.innerHTML = ``;
        let i = 0;       
        snap.forEach(member => {
          i++;
          members_list.innerHTML +=`
          <a href="#!/member_details/${member.key}">
          <div class="member">
          <div class="member_name">${i}. ${member.val().name}</div>
          </div>
          </a>
          `
        });

      })

    },

    "member_details/:id": function(params){
     
      $('.footer').hide();
      $('.top-title').html(`Member`);

      app.innerHTML = `
      <div class="body">
      <div id="member_details"></div>

      <div class="total_stats"></div>
      <div class="stats"></div>

      <div id="member_history"></div>

     

      
      </div>
      <br>

      <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Deposits</button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Deducts</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
      <div class="deposit_history"></div>
      </div>
      <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
      <div class="deduct_history"></div>
      </div>
    </div>


      <div class="modal fade" id="deposit_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Member</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="add_deposit">
      
            <div class="input-group mb-3">
            <span class="input-group-text" id="basic-addon1">Amount</span>
            <input type="number" name="amount" class="form-control" placeholder="Amount" aria-label="Username" aria-describedby="basic-addon1">
            </div>

            
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" id="deposit_button" class="btn btn-success">+Deposit</button>
          </div>
        </div>
      </div>
    </div>


    <div class="modal fade" id="deduct_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Member</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="add_deduct">

          <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">Amount</span>
          <input type="number" name="amount" class="form-control" placeholder="Amount" aria-label="Username" aria-describedby="basic-addon1">
          </div>

          <div class="form-check">
          <input class="form-check-input" name="d_status" type="radio" value="Regular Meal Charge" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            Regular Meal Charge
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" name="d_status" type="radio" value="Half Meal Charge" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            Half Meal Charge
          </label>
        </div>

       

        <div class="form-check">
          <input class="form-check-input" name="d_status" type="radio" value="Guest Meal Charge" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            Guest Meal Charge
          </label>
        </div>

        <div class="form-check">
        <input class="form-check-input" name="d_status" type="radio" value="Khala" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Khala
        </label>
      </div>

      <div class="form-check">
      <input class="form-check-input" name="d_status" type="radio" value="Feast Charge" id="flexCheckDefault">
      <label class="form-check-label" for="flexCheckDefault">
        Feast Charge
      </label>
    </div>

    <div class="form-check">
      <input class="form-check-input" name="d_status" type="radio" value="Friday Feast" id="flexCheckDefault">
      <label class="form-check-label" for="flexCheckDefault">
        Friday Feast
      </label>
    </div>

    <div class="form-check">
      <input class="form-check-input" name="d_status" type="radio" value="Personal Meal" id="flexCheckDefault">
      <label class="form-check-label" for="flexCheckDefault">
        Personal Meal
      </label>
    </div>

    <div class="form-check">
    <input class="form-check-input" name="d_status" type="radio" value="Extra" id="flexCheckDefault">
    <label class="form-check-label" for="flexCheckDefault">
      Extra
    </label>
  </div>



          
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" id="deduct_button" class="btn btn-danger">-Deduct</button>
        </div>
      </div>
    </div>
  </div>
      `

    
      let amount;
      let myname;
      db.ref('app/members/'+params.id).on('value', snap=>{
        let data = snap.val();
        amount = data.amount;
        myname = data.name;
        $('#member_details').html(`
        <div class="m_d_amount">${data.amount}
        </div>
        <div class="m_d_name">${data.name}</div>
        <br>
        <center>
        <button id="deposit" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#deposit_modal">+Deposit</button>
        <button id="deposit" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deduct_modal">-Deduct</button>

        </center>
        `);

       
        
        //deposits
        let total_deposit = 0;
        if(data.deposits){
          const deposit_history = document.querySelector('.deposit_history');
          deposit_history.innerHTML = ``;
          let deposits = Object.entries(data.deposits)
          deposits.sort(function(a, b){
            return new Date(b[1].date) - new Date(a[1].date);
           })


     

       for(let i=0; i<deposits.length; i++){
        total_deposit += deposits[i][1].amount;
        deposit_history.innerHTML += `
       <div class="dd">
       <div class="dd_status">
       <div class="dd_text">Deposited</div>
       <div class="dd_date">${dateForm(deposits[i][1].date)} ${timeForm(deposits[i][1].date)}</div>
       </div>

       <div class="dd_amount">${deposits[i][1].amount} <i class="icofont-taka-plus"></i></div>
       </div>
       `
       }

        }
        let total_deduct = 0;
        let regular = 0;
      let guest = 0;
      let half = 0;
      let khala = 0;
      let extras = 0;
      if(data.deducts){
        const deduct_history = document.querySelector('.deduct_history');
        deduct_history.innerHTML = ``;
       let deducts = Object.entries(data.deducts)
       deducts.sort(function(a, b){
        return new Date(b[1].date) - new Date(a[1].date);
       })

      
    
       for(let i=0; i<deducts.length; i++){
        total_deduct += deducts[i][1].amount;
        if(deducts[i][1].status === 'Regular Meal Charge') regular++;
        if(deducts[i][1].status === 'Guest Meal Charge') guest++;
        if(deducts[i][1].status === 'Half Meal Charge') half++;
        if(deducts[i][1].status === 'Extra') extras+= parseInt(deducts[i][1].amount);
        if(deducts[i][1].status === 'Khala'){
          khala = deducts[i][1].amount;
        }
        deduct_history.innerHTML += `
       <div class="dd">
       <div class="dd_status">
       <div class="dd_text">${deducts[i][1].status}</div>
       <div class="dd_date">${dateForm(deducts[i][1].date)} ${timeForm(deducts[i][1].date)}</div>
       </div>

       <div class="dd_amount">${deducts[i][1].amount} <i class="icofont-taka-minus"></i></div>
       </div>
       `
       }
      }

       $('.total_stats').html(`
       <div style="background: green; color: #eee;" class="stat">
       <div class="stat-count">${total_deposit}</div>
       <div class="stat-text">Total Dep.</div>
       </div>

       <div style="background: crimson; color: #eee;" class="stat">
       <div class="stat-count">${total_deduct}</div>
       <div class="stat-text">Total Ded.</div>
       </div>
       
       `)

       $('.stats').html(`
       

       <div class="stat">
      <div class="stat-count">${regular}x25 = ${regular*25}</div>
      <div class="stat-text">Meal</div>
      </div>

      <div class="stat">
      <div class="stat-count">${half}x15 = ${half*15}</div>
      <div class="stat-text">Half</div>
      </div>

      <div class="stat">
      <div class="stat-count">${guest}x30 = ${guest*30}</div>
      <div class="stat-text">Guest</div>
      </div>

      <div class="stat">
      <div class="stat-count">${khala}</div>
      <div class="stat-text">Khala</div>
      </div>

      <div class="stat">
      <div class="stat-count">${extras}</div>
      <div class="stat-text">Extras</div>
      </div>
       `)

       $('.m_d_amount').text(total_deposit-total_deduct)

      });
    
      //deposit
      $('#deposit_button').click(function(){
        const add_deposit = document.getElementById('add_deposit');
        console.log(total);
        db.ref('app/members/'+params.id+"/deposits").push({
          amount: parseInt(add_deposit.amount.value),
          date: (new Date()).toString()
        });
        db.ref('app/members/'+params.id).update({
          amount: amount+parseInt(add_deposit.amount.value),
        });
        db.ref('app/manager').update({
          total: total+parseInt(add_deposit.amount.value)
        })
        db.ref('app/manager/deposits').push({
          name: myname,
          amount: parseInt(add_deposit.amount.value),
          date: (new Date()).toString()
        })
      })

      //deduct 
      $('#deduct_button').click(function(){
        const add_deduct = document.getElementById('add_deduct');
        // console.log(total);
        db.ref('app/members/'+params.id+"/deducts").push({
          amount: parseInt(add_deduct.amount.value),
          date: (new Date()).toString(),
          status: add_deduct.d_status.value
        });
        db.ref('app/members/'+params.id).update({
          amount: amount-parseInt(add_deduct.amount.value),
        });
        db.ref('app/manager').update({
          total: total-parseInt(add_deduct.amount.value)
        })

        db.ref('app/manager/deducts').push({
          name: myname,
          status: add_deduct.d_status.value,
          amount: parseInt(add_deduct.amount.value),
          date: (new Date()).toString(),         
        });

        db.ref('app/manager/dailyMeal/'+getDateId()).push({
          name: myname,
          status: add_deduct.d_status.value,
          amount: parseInt(add_deduct.amount.value),
          date: (new Date()).toString()
        });

      });


     




    },
    "/bazaar": function(){
      $('.top-title').html(`Bazaar List`);
      $('.footer').show();
      $('.footertext').hide();
      $('.footerIcon').removeClass('footerIconActive');
      if($('.bzr')[0].classList[3] === undefined){
        $('.bzr').addClass('footerIconActive');
        $($($('.bzr')[0].parentNode)[0].lastElementChild).show();
      }

      app.innerHTML = `
      <div class="body">
      <div class="bazar_list">
      
      </div>
      </div>


     

      <div class="float_add" data-bs-toggle="modal" data-bs-target="#b_modal">
      <img src="../images/plus.png">
      </div>

     

        <!-- Modal -->
        <div class="modal fade" id="b_modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Add Member</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <form id="add_bzr">
                
                <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Name</span>
                <input type="text" name="username" class="form-control" placeholder="Member Name" aria-label="Username" aria-describedby="basic-addon1">
                </div>

                <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Date</span>
                <input type="date" id="start" name="bzr_date"
                min="2022-10-16" max="2022-10-31">
                </div>

                

                
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" id="add_bzr_button" class="btn btn-primary">Add Bazaar</button>
              </div>
            </div>
          </div>
        </div>
      `

      let bazaar = [];

      db.ref('app/bazaar').on('value', snap=> {
        bazaar = []
        // console.log(bazaar)

        snap.forEach(item=>{
          bazaar.push({
            name: item.val().name,
            date: item.val().date
          })
        })

        console.log(bazaar)

        const bazar_list = document.querySelector('.bazar_list')
        bazar_list.innerHTML = ``;
        for(let i=0; i<bazaar.length; i++){
          let d=(bazaar[i].date).split(' ');
          bazar_list.innerHTML += `
          <div class="bzr_item">
          <div class="name">${i+1}. ${bazaar[i].name}</div>
          <div class="date">
          <div class="day">${d[0]}</div>
          <div class="d">${d[2]} ${d[1]}</div>
          </div>
          </div>
          `
        }
       
      })

      const add_bzr = document.getElementById('add_bzr')
      $('#add_bzr_button').click(function(){
        let bazaar_date = (new Date(add_bzr.bzr_date.value)).toString();
        let day = bazaar_date.split(' ')[2];
        let data = {
          name: add_bzr.username.value,
          date: bazaar_date
        }
        let found = false;
        for(i in bazaar){
          let day2 = (bazaar[i].date).split(' ')[2];
          if(day == day2) {
            found = true;
            break;
          }
        }

        if(found){
          Swal.fire({
            icon: 'error',
            text: 'This date is booked! Please choose another one!'
          });
        }else{
          if((data.name).trim() != ''){
          Swal.fire({
            icon: 'question',
            text: 'Are you sure?',
            footer: 'You will never be able to change it!',
            confirmButtonText: 'Yes',
            showConfirtmButton: true,
            showCancelButton: true
          }).then(res=>{
            if(res.isConfirmed){
            
                db.ref('app/bazaar').push(data);
              Swal.fire({
                icon: 'success',
                text: 'Assigned to Bazaar successfully!'
              })
              
              
            }
            
          })

        }else{
          Swal.fire({
            icon: 'error',
            text: 'Please enter a name!'
          });
        }

        }
        

        
      })
      
    },

    "/summary": function(){
      $('.top-title').html(`Summary`);

      $('.top').hide();
      $('.footer').hide();

      app.innerHTML = `
      <div class="body">
      
      <table class="table" border="1">
      <thead>
      <tr>
      <th scope="col">No.</th>
      <th scope="col">Name</th>
      <th scope="col">Meal</th>
      <th scope="col">Guest</th>
      <th scope="col">Personal</th>
      <th scope="col">Extra</th>
      <th scope="col">Khala</th>
      <th scope="col">Deposited</th>
      <th scope="col">Deducted</th>
      <th scope="col">Remaining</th>
      </tr>
      </thead>

      <tbody id="table_body">
      
      </tbody>
      
      </table>
      
      </div>
      `

      const table_body = document.getElementById('table_body');

      db.ref('app/members').once('value', snap=> {
        table_body.innerHTML = '';
        let khala = 110;
        let extra = 86;

        let totalMeal = 0;
        let totalGuest = 0;
        let totalPersonal = 0;
        let totalExtra = 0;
        let totalKhala = 0;
        let totalDep = 0;
        let totalDid = 0;
        let totalRem = 0;
        let totalG = 0;
        
        
        let no = 0;
        snap.forEach(item=>{
          no++;
          let reg = 0;
          let guest = 0;
          let g = 0;
          let personal = 0;
          let deposited = 0;
          let deducted = 0;
          
          
          let m = item.val();
          if(m.deposits){
            let deposits = Object.entries(m.deposits);
            for(let i=0; i<deposits.length; i++){
              deposited += parseInt(deposits[i][1].amount);
            }
          }

          
          if(m.deducts){
            let deducts = Object.entries(m.deducts);
            let deposits = Object.entries(m.deducts);
            for(let i=0; i<deducts.length; i++){
              deducted += deducts[i][1].amount;
              if(deducts[i][1].status == 'Regular Meal Charge' || deducts[i][1].status == 'Half Meal Charge'){
                reg += deducts[i][1].amount;
              }
              if(deducts[i][1].status == 'Guest Meal Charge'){
                guest += deducts[i][1].amount;
                g++;
              }
              if(deducts[i][1].status == 'Personal Meal' || deducts[i][1].status == 'WiFi Bill' || deducts[i][1].status == 'Feast Meal'){
                personal += deducts[i][1].amount;
              }


            }
          }
         
          
         
          if(m.name == 'Girls Guest(2)'){
            khala = 0;
            extra = extra*2;
          }else{
            khala = 110;
            extra = 86;
          }

          let gs = `${guest}(x${g})`;

          if(g==0){
            gs = '-';
          }
          

          totalExtra += extra;
          totalKhala += khala;
          totalDep += deposited;
          totalDid += deducted;
          totalMeal += reg;
          totalGuest += guest;
          totalPersonal += personal;
          totalG+= g;

          if((deposited - deducted) <= 0){
            table_body.innerHTML +=`
          <tr>
          <td>${no}</td>
          <td>${m.name}</td>
          <td>${reg}</td>
          <td>${gs}</td>
          <td>${personal}</td>
          <td>${extra}</td>
          <td>${khala}</td>
          <td>${deposited}</td>
          <td>${deducted}</td>
          <td class="rem_w">${deposited - (reg+guest+personal+extra+khala)}</td>
          </tr>
          `
          }else{
            table_body.innerHTML +=`
          <tr>
          <td>${no}</td>
          <td>${m.name}</td>
          <td>${reg}</td>
          <td>${gs}</td>
          <td>${personal}</td>
          <td>${extra}</td>
          <td>${khala}</td>
          <td>${deposited}</td>
          <td>${deducted}</td>
          <td>${deposited - (reg+guest+personal+extra+khala)}</td>
          </tr>
          `
          }
          


        });

        table_body.innerHTML +=`
          <tr class="total_row">
          <td>#</td>
          <td>Total</td>
          <td>${totalMeal}</td>
          <td>${totalGuest}</td>
          <td>${totalPersonal}</td>
          <td>${totalExtra}</td>
          <td>${totalKhala}</td>
          <td>${totalDep}</td>
          <td>${(totalMeal+totalGuest+totalPersonal+totalExtra+(totalKhala))}</td>
          <td>${totalDep-totalDid}</td>
          </tr>
          `




      })
    }

 







}).resolve();



router.notFound(function(){
  app.innerHTML=`404`;
});

// history.pushState({page: 1}, "home", "#!/")

// $('a').click(function(){
//   history.pushState({page: 1}, "home", "#!/")
// });


function getDateId(){
  let d = ((new Date()).toString()).split(' ');
  let res = d[1]+d[2]+d[3];
  return res;
}
