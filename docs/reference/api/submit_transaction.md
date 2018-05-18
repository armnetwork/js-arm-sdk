---
title: submitTransaction()
---

## Overview

You can build a transaction locally (see [this example](../readme.md#building-transactions)), but after you build it you have to submit it to the Stellar network.  js-arm-sdk has a function `submitTransaction()` that sends your transaction to the Horizon server (via the [`transactions_create`] endpoint) to be broadcast to the Stellar network.

## Methods

| Method | Horizon Endpoint | Param Type | Description |
| --- | --- | --- | --- |
| `submitTransaction(Transaction)` | | Submits a transaction to the network.

## Example

```js
var ArmSdk = require('arm-sdk')
var server = new ArmSdk.Server('https://horizon-testnet.domain.xyz');

var transaction = new ArmSdk.TransactionBuilder(account)
        // this operation funds the new account with XLM
        .addOperation(ArmSdk.Operation.payment({
            destination: "GASOCNHNNLYFNMDJYQ3XFMI7BYHIOCFW3GJEOWRPEGK2TDPGTG2E5EDW",
            asset: ArmSdk.Asset.native(),
            amount: "20000000"
        }))
        .build();

transaction.sign(ArmSdk.Keypair.fromSeed(seedString)); // sign the transaction

server.submitTransaction(transaction)
    .then(function (transactionResult) {
        console.log(transactionResult);
    })
    .catch(function (err) {
        console.error(err);
    });
```
