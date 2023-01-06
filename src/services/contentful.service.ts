import { Injectable } from '@angular/core';
import * as contentful from 'contentful';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { INLINES, BLOCKS } from '@contentful/rich-text-types';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { CONTENTFUL } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  constructor() { }

  private client = contentful.createClient({
    space: CONTENTFUL.spaceId,
    accessToken: CONTENTFUL.token,
    environment: CONTENTFUL.environment
  });
  public options = {
    renderNode: {
      [INLINES.HYPERLINK]: (node) => {
        return `<a target="_blank" href="${node.data.uri}">${node.content[0].value}</a>`;
      },
      'embedded-asset-block': (node) => {
        let file = node.data.target.fields.file;
        let renderedMedia = this.renderMedia(file);
        return renderedMedia;
      },
      [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content).replace(/\n/g, '<br/>')}</p>`,

    },
  };

  public getField(contentId): Observable<any> {

    const promise = this.client.getEntry(contentId);
    return from(promise)
      .pipe(
        map(entry => entry.fields)
      );
  }
  public getContent(contentId): Observable<any> {
    const p = this.client.getEntries({ content_type: contentId });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
  }
  public getPageContentByInternalName(contentId, internalName, locale?): Observable<any> {
    const p = this.client.getEntries({
      'fields.internalName': internalName,
      content_type: contentId,
      locale,
      include: 2
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
}
  public getphoneTypes(contentId, categoryId): Observable<any> {
    const p = this.client.getEntries({
      'fields.categoryId': categoryId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
  }
  public getphoneName(contentId, phoneId): Observable<any> {
    const p = this.client.getEntries({
      'fields.phoneId': phoneId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields)
      );
  }
  public getCategoryId(contentId, phoneId): Observable<any> {
    const p = this.client.getEntries({
      'fields.phoneId': phoneId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields)
      );
  }
  public getPhoneSpecData(contentId, phoneId): Observable<any> {
    const p = this.client.getEntries({
      'fields.phoneId': phoneId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );

  }

  public getOneDefaultFinishesField(contentId, phoneId): Observable<any> {
    const p = this.client.getEntries({
      'fields.phoneId': phoneId,
      content_type: contentId,
    });
    return from(p)
      .pipe(
        map(entry => entry?.items[0]?.fields)
      );
  }
  public getOneDefaultCapacityField(contentId, phoneId): Observable<any> {
    const p = this.client.getEntries({
      'fields.phoneId': phoneId,
      content_type: contentId,
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields)
      );
  }
  public getPhoneImg(contentId, finishId): Observable<any> {
    const p = this.client.getEntries({
      'fields.finishId': finishId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields)
      );
  }
  public getPhoneImgBySku(contentId, sku): any {
    const p = this.client.getEntries({
      'fields.sku': sku,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields['skuFinishId'])
      );
  }
  public getPhoneCapacity(contentId, capacityId): Observable<any> {
    const p = this.client.getEntries({
      'fields.capacityId': capacityId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields)
      );
  }
  public getContentByCarrierId(contentId, carrierId): Observable<any> {
    const p = this.client.getEntries({
      'fields.carrierId': carrierId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
  }
  public getQuestionsByCategoryId(contentId, categoryId): Observable<any> {
    const p = this.client.getEntries({
      'fields.categoryId': categoryId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
  }
  public renderMedia(file): any {
    if (file.contentType === 'video/mp4') {
      return (
        `<video width:200px; height:100px; controls>
            <source src=${file.url} type='video/mp4'/>
            <p>Your browser doesnt support HTML5 video.</p>
          </video>`
      );
    } else if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' ||
      file.contentType === 'image/gif' || file.contentType === 'image/svg+xml') {
      return (`<img class="promise__img-three" src=${file.url} /> `);
    }
    else if (file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.contentType === 'application/msword' || file.contentType === 'application/vnd.ms-powerpoint') {
      return (
        ` <img class="download-icon" src="/assets/icon/Download-icon.svg" alt="download link icon"><a href="${file.url}" download="g2g-files"> Download additional info. </a><br>`
      );
    }
    else if (file.contentType === 'application/pdf') {
      return (
        ` <img class="download-icon" src="/assets/icon/Download-icon.svg"
       alt="download link icon"><a href="${file.url}" target="_blank" download="g2g-files"> Download additional info. </a><br>`
      );
    }
  }
  public getRichTextWithOptions(richText): any {
    return documentToHtmlString(richText, this.options);
  }
  public getRichText(contentId, answerId): any {
    this.client
      .getEntries({
        'fields.answerId': answerId,
        content_type: contentId
      })
      .then(entry => {
        const rawRichTextField = entry.items[0].fields;
        return documentToHtmlString(rawRichTextField['answerText'], this.options);
      })
      .then(renderedHtml => {
        document.getElementById(answerId).innerHTML = renderedHtml;
      })
      .catch(error => console.error(error));
  }
  public getAnswerIdByQstId(contentId, qstId): Observable<any> {
    const p = this.client.getEntries({
      'fields.questionId': qstId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items[0].fields)
      );
  }
  public getPopUpDescriptions(contentId, elementId , richTextField): any {
    this.client.getEntries({
      content_type: contentId
    })
      .then(entry => {
        const rawRichTextField = entry.items[0].fields;
        return documentToHtmlString(rawRichTextField[`${richTextField}`], this.options);
      })
      .then(renderedHtml => {
        document.getElementById(elementId).innerHTML = renderedHtml;
      })
      .catch(error => console.error(error));
  }
  public getDescriptions(contentId, elementId, categoryId, richTextField): any {
    this.client.getEntries({
      'fields.categoryId': categoryId,
      content_type: contentId
    })
      .then(entry => {
        const rawRichTextField = entry.items[0].fields;
        return documentToHtmlString(rawRichTextField[`${richTextField}`], this.options);
      })
      .then(renderedHtml => {
        document.getElementById(elementId).innerHTML = renderedHtml;
      })
      .catch(error => console.error(error));
  }
  public getTestimonialsByPageId(contentId, pageId): Observable<any> {
    const p = this.client.getEntries({
      'fields.testimonialsPageId': pageId,
      content_type: contentId
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
  }
  public getInternationalCallingContentByCategory(contentId, limit, catgeory, locale?): Observable<any> {
    const p = this.client.getEntries({
      'fields.categoryId': catgeory,
      include: 2,
      limit,
      content_type: contentId,
      locale
    });
    return from(p)
      .pipe(
        map(entry => entry.items)
      );
  }
}
