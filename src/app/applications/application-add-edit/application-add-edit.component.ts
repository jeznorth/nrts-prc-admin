import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Response } from '@angular/http/src/static_response';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';

import { Constants } from 'app/utils/constants';
import { AppComponent } from 'app/app.component';
import { SelectOrganizationComponent } from '../select-organization/select-organization.component';
import { ConfirmComponent } from 'app/confirm/confirm.component';
import { Application } from 'app/models/application';
import { Document } from 'app/models/document';
import { Organization } from 'app/models/organization';
import { ApiService } from 'app/services/api';
import { DocumentService } from 'app/services/document.service';
import { ApplicationService } from 'app/services/application.service';
import { OrganizationService } from 'app/services/organization.service';

@Component({
  selector: 'app-application-add-edit',
  templateUrl: './application-add-edit.component.html',
  styleUrls: ['./application-add-edit.component.scss']
})
export class ApplicationAddEditComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') private fileInput;

  public types = Constants.types;
  public subtypes = Constants.subtypes;
  public purposes = Constants.purposes;
  public subpurposes = Constants.subpurposes;
  public statuses = Constants.statuses;

  public loading = false;
  public fileList: FileList;
  public application: Application;
  public applicationDocuments: Array<Document> = [];
  public error = false;
  public showMsg = false;
  public status: string;
  public clFile: number = null;
  private ngUnsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private documentService: DocumentService,
    private orgService: OrganizationService,
    private applicationService: ApplicationService,
    private dialogService: DialogService
  ) { }

  fileChange(event) {
    this.fileList = event.target.files;
  }

  typeChange(obj) {
    this.application.subtype = Constants.subtypes[obj][0];
  }

  purposeChange(obj) {
    this.application.subpurpose = Constants.subpurposes[obj][0];
  }

  selectClient() {
    const self = this;
    let orgId = null;
    if (this.application.proponent) {
      orgId = this.application.proponent._id;
    }
    this.dialogService.addDialog(SelectOrganizationComponent,
      {
        selectedOrgId: orgId
      }, {
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((selectedOrgId) => {
        if (selectedOrgId) {
          // Fetch the org from the service, and bind to this instance of an application.
          self.orgService.getById(selectedOrgId)
            .subscribe(
              data => {
                self.application.proponent = new Organization(data);
                // Update current reference.
                self.application._proponent = data._id;
              },
              error => {
                console.log('error =', error);
              });
        } else {
          console.log('org selection cancelled');
        }
      });
  }

  addCLFile() {
    if (this.application.cl_files === null) {
      this.application.cl_files = [];
    }
    this.application.cl_files.push(this.clFile);
    this.clFile = null;
  }

  removeCLFile(clFile) {
    _.remove(this.application.cl_files, function (item) {
      return (item === clFile);
    });
  }

  onSubmit() {
    // Adjust for current tz
    this.application.projectDate = moment(this.application.projectDate).format();

    const self = this;
    this.api.saveApplication(this.application)
      .subscribe(
        (application) => {
          // console.log('application =', application);
          self.showMessage(false, 'Saved application!');
        },
        error => {
          console.log('error =', error);
          self.showMessage(true, 'Error saving application');
        });
  }

  private showMessage(isError, msg) {
    this.error = isError;
    this.showMsg = true;
    this.status = msg;
    setTimeout(() => this.showMsg = false, 5000);
  }

  uploadFiles() {
    const self = this;
    const fileList = Object.assign({}, this.fileList); // copy of files
    this.fileInput.nativeElement.value = ''; // clear input

    _.each(fileList, function (file) {
      if (file) {
        const formData = new FormData();
        formData.append('_application', self.application._id);
        formData.append('displayName', file.name);
        formData.append('upfile', file);
        self.api.uploadDocument(formData)
          .subscribe(
            (document) => {
              // do stuff w/my uploaded file
              console.log('document =', document.json());
              self.applicationDocuments.push(document.json());
            },
            error => {
              console.log('error =', error);
            });
      }
    });
  }

  removeDocument(document: Document) {
    const self = this;
    this.api.deleteDocument(document)
      .subscribe(res => {
        const doc = res.json();
        // In-memory removal on successful delete.
        _.remove(self.applicationDocuments, function (item) {
          return (item._id === doc._id);
        });
      });
  }

  publishDocument(document: Document) {
    const self = this;
    this.api.publishDocument(document)
      .subscribe(res => {
        const doc = res.json();
        const f = _.find(self.applicationDocuments, function (item) {
          return (item._id === doc._id);
        });
        f.isPublished = true;
      });
  }

  unPublishDocument(document: Document) {
    const self = this;
    this.api.unPublishDocument(document)
      .subscribe(res => {
        const doc = res.json();
        const f = _.find(self.applicationDocuments, function (item) {
          return (item._id === doc._id);
        });
        f.isPublished = false;
      });
  }

  publishApplication(app: Application) {
    this.applicationService.publish(app);
  }

  unPublishApplication(app: Application) {
    this.applicationService.unPublish(app);
  }

  deleteApplication(app: Application) {
    this.dialogService.addDialog(ConfirmComponent,
      {
        title: 'Confirm deletion',
        message: 'Do you really want to delete this application?'
      }, {
        // index: 0,
        // autoCloseTimeout: 10000,
        // closeByClickingOutside: true,
        backdropColor: 'rgba(0, 0, 0, 0.5)'
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe((isConfirmed) => {
        // we get dialog result
        if (isConfirmed) {
          this.applicationService.deleteApplication(app)
            .subscribe(res => {
              this.router.navigate(['/applications']);
            });
        }
      });
  }

  ngOnInit() {
    // If we're not logged in, redirect.
    if (!this.api.ensureLoggedIn()) {
      return; // return false;
    }

    this.loading = true;
    const self = this;

    // wait for the resolver to retrieve the application details from back-end
    this.route.data
      .takeUntil(this.ngUnsubscribe)
      .subscribe(
        (data: { application: Application }) => {
          this.loading = false;
          this.application = data.application;
          if (!this.application.projectDate) {
            this.application.projectDate = new Date();
          }
          this.application.projectDate = moment(this.application.projectDate).format();
          // application not found --> navigate back to application list
          if (!this.application || !this.application._id) {
            console.log('application not found');
            this.router.navigate(['/applications']);
          }

          this.documentService.getAllByApplicationId(this.application._id)
            .subscribe((docs: Document[]) => {
              this.applicationDocuments = docs;
            });

          if (self.application._proponent) {
            this.orgService.getById(self.application._proponent)
              .subscribe((o: Organization) => {
                self.application.proponent = new Organization(o);
              });
          }
        },
        error => {
          this.loading = false;
          // If 403, redir to /login.
          if (error.startsWith('403')) {
            this.router.navigate(['/login']);
          }
          alert('error loading application');
        });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}