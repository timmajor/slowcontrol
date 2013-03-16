function(doc) {
  if (doc.timestamp && (doc.ios == 3)) {
      emit(doc.timestamp,doc) 
  }
};
