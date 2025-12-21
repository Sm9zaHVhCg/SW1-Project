package de.dhbwstuttgart.wordlebackend.api.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.dhbwstuttgart.wordlebackend.api.model.Word;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class WordResponse {
    @JsonProperty("wordId")
    private Long wordId;

    @NotNull
    @JsonProperty("wordTitle")
    private String wordTitle;

    @NotNull
    @JsonProperty("wordDescription")
    private String wordDescription;

    @NotNull
    @JsonProperty("topic")
    private String topic;

    @NotNull
    @JsonProperty("wordStatus")
    private String wordStatus;

    @JsonProperty("lastUsed")
    private Instant lastUsed;

    public WordResponse mapWordToWordResponse(Word word) {
        WordResponse wordResponse = new WordResponse();
        wordResponse.setWordId(word.getWordId());
        wordResponse.setWordTitle(word.getWordTitle());
        wordResponse.setWordDescription(word.getWordDescription());
        wordResponse.setTopic(word.getTopic());
        wordResponse.setWordStatus(word.getWordStatus());
        wordResponse.setLastUsed(word.getLastUsed());
        return wordResponse;
    }
}
