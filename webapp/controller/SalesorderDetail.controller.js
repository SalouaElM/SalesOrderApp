sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("ap.salesorderapp.controller.SalesorderDetail", {
            onInit: function () {
                let oRouter = this.getOwnerComponent().getRouter()
                oRouter.getRoute("master").attachPatternMatched(this._onSalesorderMatched, this);
                oRouter.getRoute("detail").attachPatternMatched(this._onSalesorderMatched, this);
            },
            _onSalesorderMatched: function (oEvent) {
                let sSalesorderID = oEvent.getParameter("arguments").salesorder || "0";
                this.getView().bindElement({
                    path: `/SalesorderSet('${sSalesorderID}')`,
                    model: ""
                });
            },

            onExit: function () {
                this.oRouter.getRoute("list").detachPatternMatched(this._onSalesorderMatched, this);
                this.oRouter.getRoute("detail").detachPatternMatched(this._onSalesorderMatched, this);
            }
        });
    });