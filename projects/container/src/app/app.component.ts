import { Compiler, Component, Injector, ViewChild, ViewContainerRef } from '@angular/core';

import * as AngularCommon from '@angular/common';
import * as AngularCore from '@angular/core';

declare var SystemJS;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  libName = '';

  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc;

  constructor(private compiler: Compiler,
    private injector: Injector) {
  }

  load() {
    
    // register the modules that we already loaded so that no HTTP request is made
    // in my case, the modules are already available in my bundle (bundled by webpack)
    SystemJS.set('@angular/core', SystemJS.newModule(AngularCore));
    SystemJS.set('@angular/common', SystemJS.newModule(AngularCommon));

    // import('dist/my-lib').then((module) => {
    //   console.log(module);
    // });

    // now, import the new module
    //'dist/my-lib/bundles/my-lib.umd.js'
    SystemJS.import(this.libName).then((module) => {
      console.log(module);
      this.compiler.compileModuleAndAllComponentsAsync(module[`MyLibModule`])
        .then((compiled) => {
          let moduleRef = compiled.ngModuleFactory.create(this.injector);
          let factory = compiled.componentFactories[0];
          if (factory) {
            let component = this.vc.createComponent(factory);
            let instance = component.instance;
          }
        });
    });
  }
}
