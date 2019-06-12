import { Component , OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms"

import { ArticalService } from "./article.service";
import { Artical } from "./article";

@Component({
    selector: "app-artical",
    templateUrl : "./artical.component.html",
    styleUrls : ["./artical.component.css"]
})

export class ArticalComponent implements OnInit {
    //Component properties
    allArticals : Artical[];
    statusCode : number;
    requestProcessing : false;
    articalIdToUpdate : null;
    processValidation : false;

    //Create Form
    articalForm = new FormGroup({
        title : new FormControl("",Validators.required),
        category : new FormControl("", Validators.required)
    });

    //Create constructor to get service instance
    constructor(private articalService : ArticalService){

    }

    //Create ngOnInit() and and load articles
    ngOnInit() : void {
        this.getAllArticals();
    }

    //Fetch all articles
    getAllArticals () {
        this.articalService.getAllArticals().subscribe(data => this.allArticals = data,
                                                        errorCode => this.statusCode = errorCode);
    }

    //Handle create and update article
    onArticalFormSubmit () {
        this.processValidation = true;

        if(this.articalForm.invalid){
            return; //Validation failed, exit from method.
        }

        //Form is valid, now perform create or update
        this.preProcessConfiguration();

        let title = this.articalForm.get("title").value.trim();
        let category = this.articalForm.get("category").value.trim();

        if(this.articalIdToUpdate === null){
            //Handle create article
            let artical = new Artical(null, title, category);
            this.articalService.createArtical(artical).subscribe(
                successCode =>{
                    this.statusCode = successCode;
                    this.getAllArticals;
                    this.backToCreateArtical();
                },
                errorCode => this.statusCode = errorCode
            );
        }else{
            //Handle update article
            let artical = new Artical(this.articalIdToUpdate,title, category);
            this.articalService.updateArticle(artical).subscribe(
                successCode => {
                    this.statusCode = successCode;
                    this.getAllArticals();
                    this.backToCreateArtical();
                },
                errorCode => this.statusCode = errorCode
            );
        }
    }

    //Load article by id to edit
    loadArticleToEdit(articalId: string) {
      this.preProcessConfigurations();
      this.articalService.getArticalById(articalId)
	      .subscribe(article => {
		            this.articalIdToUpdate = article.articalId;   
		            this.articalForm.setValue({ title: article.title, category: article.category });
			    this.processValidation = true;
			    this.requestProcessing = false;   
		    },
		    errorCode =>  this.statusCode = errorCode);   
   }

   //Delete article
   deleteArticle(articleId: string) {
    this.preProcessConfigurations();
    this.articalService.deleteArticleById(articleId)
        .subscribe(successCode => {
            this.statusCode = successCode;
            this.getAllArticals();	
            this.backToCreateArticle();
         },
         errorCode => this.statusCode = errorCode);    
 }

    //Perform preliminary processing configurations
    preProcessConfigurations() {
        this.statusCode = null;
        this.requestProcessing = true;   
    }

    //Go back from update to create
    backToCreateArticle() {
        this.articalIdToUpdate = null;
        this.articalForm.reset();	  
        this.processValidation = false;
    }
}