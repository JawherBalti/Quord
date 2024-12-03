import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/delete-image';

  deleteImage(publicId: string): Observable<any> {
    return this.http.post(this.apiUrl, { public_id: publicId });
  }

  getPublicIdFromUrl(url: string): string {
    // https://res.cloudinary.com/dv1lhvgjr/image/upload/v1732917873/npl7xlvsulqyobm7imxr.png

    // Remove base URL and optional version
    const parts = url.split('/upload/');
    if (parts.length < 2) {
      throw new Error('Invalid Cloudinary URL');
    }

    // Extract the path after "upload/"
    let path = parts[1];

    // Remove any version info (e.g., "v1234567890/")
    path = path.replace(/^v[0-9]+\/?/, '');

    // Remove file extension (e.g., ".jpg")
    const publicId = path.substring(0, path.lastIndexOf('.')) || path;

    return publicId;
  }

}
