// import { SelectObject } from "../interface/base.response.interface";
// import { KafkaService } from "src/modules/kafka/kafka.service";
// import { Inject, Injectable } from "@nestjs/common";
// import { KAFKA_CONSTANT } from "./constants";

// @Injectable()
// export class FilterHelper {
//     constructor(
//         @Inject(KafkaService) private readonly kafkaService: KafkaService,
//     ) { }
//     public filterArray<T>(result: T[], args: string[]): T[] { // this take two parameter 1) result: An array of objects of type T that needs to be filtered. 2). args: An array of strings representing the user-defined arguments used for filtering.
//         // Filter the array based on user-defined arguments
//         try {
//             return result?.map((item) => {  //  map function is applied to the result array. This allows iterating over each item in the array and performing a transformation
//                 const filteredItem: Partial<T> = {};
//                 Object?.keys(item)?.forEach((key) => { // The Object.keys(item) function retrieves an array of keys from the current item in the iteration. This allows iterating over each property of the item.
//                     if (!args?.includes(key)) {
//                         filteredItem[key] = item[key];
//                     }
//                 });
//                 return filteredItem as T;  // Once all properties have been processed, the filteredItem is returned as a result of the map function. It is casted back to type T using the as T syntax to ensure the return type matches the original item type.
//             });
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { filterArray: error }, { fileName: Buffer.from(__filename), className: Buffer.from('FilterHelper'), methodName: Buffer.from('filterArray') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'filterArray Helper')
//         }
//     }


//     public createSelectObject(...stringArrays: string[][]): SelectObject { // he function itself is annotated to indicate that it takes in multiple arrays of strings (string[][]) as parameters and returns a SelectObject
//         const result: SelectObject = {};            // We've added a type annotation SelectObject to define the structure of the resulting object. It represents an object that can have nested properties or be set to true
//         try {
//             stringArrays?.forEach((array, index) => {
//                 if (index === 0) {
//                     array?.forEach((item) => {
//                         result[item] = true;
//                     });
//                 } else if (index > 0) {
//                     let array2 = '';
//                     array?.forEach((item, innerIndex) => {
//                         if (innerIndex === 0) {
//                             array2 = item;
//                             result[item] = {};
//                         } else if (innerIndex > 0) {
//                             result[array2][item] = true;
//                         }
//                     });
//                 }
//             });
//             return result;
//         } catch (error) {
//             this.kafkaService.send(KAFKA_CONSTANT.KAFKA_TOPIC, { createSelectObject: error }, { fileName: Buffer.from(__filename), className: Buffer.from('FilterHelper'), methodName: Buffer.from('createSelectObject') }).then().catch((error) => console.error('Failed to send message:', error));
//             console.error(error, 'createSelectObject')
//         }

//     }

// }
