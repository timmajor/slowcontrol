function(doc) {
  if (doc.timestamp && !(doc.ios) && (doc.approved==1)) {
      emit(doc.timestamp,doc) 
  }
};
