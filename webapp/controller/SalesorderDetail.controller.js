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
                var sSalesorderID = oEvent.getParameter("arguments").salesorder || "0";
                var sSalesorderPath = `/SalesOrderSet('${sSalesorderID}')`;
            
                this.getView().bindElement({
                    path: sSalesorderPath,
                    model: ""
                });
            
                // Assuming 'SalesorderDetail' view has an ID for the table: 'salesorderdetailTable'
                var oTable = this.getView().byId("salesorderdetailTable");
                oTable.bindItems({
                    path: sSalesorderPath + "/SalesOrder_itemSet",
                    template: oTable.getBindingInfo("items").template
                });
            },

            onExit: function () {
                this.oRouter.getRoute("list").detachPatternMatched(this._onSalesorderMatched, this);
                this.oRouter.getRoute("detail").detachPatternMatched(this._onSalesorderMatched, this);
            }
        });
    });