sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/Device',
    'sap/f/library',
    'sap/ui/model/Sorter',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter',
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Device, fioriLibrary, Sorter, Fragment, Filter) {
        "use strict";

        return Controller.extend("ap.salesorderapp.controller.Main", {
            onInit: function () {
                // Keeps reference to any of the created sap.m.ViewSettingsDialog-s in this sample
			    this._mViewSettingsDialogs = {};
            },

            onListItemPress: function (oEvent) {
                let sSalesorderPath = oEvent.getSource().getBindingContext().getPath(),
                oSelectedSalesorder = sSalesorderPath.split("'")[1]; // We split the path /SalesOrderSet('SHRT1636') into 3 pieces by splitting on '

                this.getOwnerComponent().getRouter().navTo("detail", {layout: fioriLibrary.LayoutType.TwoColumnsMidExpanded, salesorder: oSelectedSalesorder});
            },
            handleFilterButtonPressed: function () {
                this.getViewSettingsDialog("ap.salesorderapp.fragments.filterDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            handleFilterDialogConfirm: function (oEvent) {
                var oTable = this.byId("salesorderTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    aFilters = [];

                mParams.filterItems.forEach(function(oItem) {
                    let sPath = oItem.getParent().getKey(),
                        sOperator = 'EQ', 
                        sValue1 = oItem.getKey(),
                        oFilter = new Filter(sPath, sOperator, sValue1);
                    aFilters.push(oFilter);
                });

                // apply filter settings
                oBinding.filter(aFilters);

            },
            getViewSettingsDialog: function (sDialogFragmentName) {
                var pDialog = this._mViewSettingsDialogs[sDialogFragmentName];

                if (!pDialog) {
                    pDialog = Fragment.load({
                        id: this.getView().getId(),
                        name: sDialogFragmentName,
                        controller: this
                    }).then(function (oDialog) {
                        if (Device.system.desktop) {
                            oDialog.addStyleClass("sapUiSizeCompact");
                        }
                        return oDialog;
                    });
                    this._mViewSettingsDialogs[sDialogFragmentName] = pDialog;
                }
                return pDialog;
            }, 
            handleSortButtonPressed: function () {
                this.getViewSettingsDialog("ap.salesorderapp.fragments.sortDialog")
                    .then(function (oViewSettingsDialog) {
                        oViewSettingsDialog.open();
                    });
            },
            handleSortDialogConfirm: function (oEvent) {
                var oTable = this.byId("salesorderTable"),
                    mParams = oEvent.getParameters(),
                    oBinding = oTable.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];

                sPath = mParams.sortItem.getKey();
                bDescending = mParams.sortDescending;
                aSorters.push(new Sorter(sPath, bDescending));

                // apply the selected sort and group settings
                oBinding.sort(aSorters);
            },

            onAddButtonPress: function() {
                var oView = this.getView();
            
                if (!this._oDialog) {
                    this._oDialog = Fragment.load({
                        id: oView.getId(),
                        name: "ap.salesorderapp.fragments.CreateDialog",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }
            
                this._oDialog.then(function (oDialog) {
                    oDialog.open();
                });
            },
            
            onCreateSalesOrder: function() {
                // Get the values from input fields
                var oNewSalesOrder = {
                    Vbeln: this.byId("inputVbeln").getValue(),
                    CreationDate: this.byId("inputCreationDate").getValue(),
                    Organisation: this.byId("inputOrganisation").getValue(),
                    CreatedBy: this.byId("inputCreatedBy").getValue(),
                    DocumentType: this.byId("inputDocumentType").getValue()
                };
            
                // Perform actions with the new sales order data (not implemented for backend)
                // For now, let's just close the dialog
                this._oDialog.then(function (oDialog) {
                    oDialog.close();
                    sap.m.MessageToast.show("Sales order created");
                });
            },
            
            onCancelCreateSalesOrder: function() {
                // Close the dialog on cancel
                this._oDialog.then(function (oDialog) {
                    oDialog.close();
                    sap.m.MessageToast.show("Creation of sales order canceled");
                });
            }
            
        });
    });
