import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import 'fetch';
import * as toastr from "toastr";

@inject(HttpClient)
export class Users {

  heading = 'Database Users';

  users = [];

  firstname = '';
  lastname = '';
  email = '';
  first_add = true;

  constructor(http) {
    http.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl('http://www.hockeypucktruck.com/');
    });

    this.http = http;

  }

  activate() {
    return this.http.fetch('allusers')
      .then(response => response.json())
      .then(users => this.users = users);

  }

  submit(){
    if(this.firstname === '' || this.lastname === '' || this.email === ''){
      toastr.warning("Please fill in all fields.", "Incomplete Form", {timeOut: 1000})
    }
    else{

      let user = {name: this.firstname + ' ' + this.lastname, email: this.email};

      this.http.fetch('adduser',{
          method: 'post',
          body: json(user)
      });
      
      this.update();
      
    }
  }

  delete(key){
    this.http.fetch('deleteuser/' + key, {
      method: 'DELETE'
    })
    .then(this.deleteUser(key));
  }

  /*********************************
          Internal Functions
  *********************************/

  deleteUser(key){
    toastr.info("The user " +  key + " has been deleted!", "User Deletion", {timeOut: 1000});    
    
    for(var i=this.users.length-1; i>=0; i--) 
      if( this.users[i].id != null && this.users[i].id == key) 
        this.users.splice(i,1);         
  }

  update(){
     this.http.fetch('allusers')
      .then(response => response.json())
      .then(users => this.insert(users));
  }

  insert(users){ 
      if(users.length != 0){
          this.users.push(users[users.length-1]);
      }   
      else
        this.update();
  }
}