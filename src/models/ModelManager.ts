import * as THREE from 'three'

class ModelManager {
  private _models: any = []

  constructor() {}

  addModel(model: any) {
    if (!this._models.includes(model)) {
      this._models.push(model)
      console.log('--> Model ' + model + ' loaded!')
    } else {
      console.log('--x Model ' + model + ' already here.')
    }
  }

  
}
