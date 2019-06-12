import { Injectable } from "@angular/core";
import { Http, Response, Headers, URLSearchParams, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { Artical } from "./article";

@Injectable()
export class ArticalService {
    allArticlesUrl = "http://localhost:8080/user/all-articles";
    articleUrl = "http://localhost:8080/user/article";

    //Create constructor to get Http instance
    constructor(private http : Http){

    }
    
    //Fetch All Articals
    getAllArticals() : Observable<Artical[]> {
        return this.http.get(this.allArticlesUrl).map(this.extractData).catch(this.handleError);
    }

    //Create Artical
    createArtical(artical : Artical) : Observable<number> {
        let cpHeader = new Headers({
            "Content-Type" : "application/json"
        });

        let options = new RequestOptions({
            headers : cpHeader
        });

        return this.http.post(this.articleUrl, artical, options).map(success => success.status).catch(this.handleError);
    
    }

    //Fetch Artical by ID
    getArticalById(articalId : string) : Observable<Artical> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let cpParams = new URLSearchParams();
        cpParams.set("id", articalId);

        let options = new RequestOptions({headers : cpHeaders, params : cpParams});
        
        return this.http.get(this.articleUrl, options).map(this.extractData).catch(this.handleError);
    }

    //Update article
    updateArticle(article: Artical):Observable<number> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
            let options = new RequestOptions({ headers: cpHeaders });
            return this.http.put(this.articleUrl, article, options)
                   .map(success => success.status)
                   .catch(this.handleError);
    }

    //Delete article	
    deleteArticleById(articleId: string): Observable<number> {
        let cpHeaders = new Headers({ 'Content-Type': 'application/json' });
        let cpParams = new URLSearchParams();
        cpParams.set('id', articleId);			
        let options = new RequestOptions({ headers: cpHeaders, params: cpParams });
        return this.http.delete(this.articleUrl, options)
               .map(success => success.status)
               .catch(this.handleError);
        }

        private extractData(res: Response) {
            let body = res.json();
                return body;
        }

        private handleError (error: Response | any) {
            console.error(error.message || error);
            return Observable.throw(error.status);
        }
}