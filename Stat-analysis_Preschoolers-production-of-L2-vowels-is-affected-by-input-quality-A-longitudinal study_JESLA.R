
### JESLA Preschoolers' production of L2 vowels is affected by input quality: A longitudinal study

library(dplyr)
library(tidyr)
library(ggplot2)
library(tidyverse)
library(broom)
library(lme4)
library(readxl)
library(ggeffects)
library(emmeans)
library(MuMIn)
library(openxlsx)
library(lmerTest)
library(phonR)
library(broom.mixed)
library(here)

here()

# Load data
ppts <- read_excel(here('Preschoolers-production_data.xlsx'))

# Prepare data for analysis: convert Language, Time, Input, Vowel to factors
ppts <- mutate(ppts, Language = as.factor(Language),
               Time = as.factor(Time),
               Input = as.factor(Input),
               Vowel = as.factor(Vowel))

# Filter vowels: only Cs /iː, i, e, a/ and En /i, ɪ, ɛ, æ, ʌ/ will be used for analysis
ppts <- dplyr::filter(ppts, phone %in% c('a', 'ae', 'ef', 'e', 'is', 'ic', 'vt', 'ii', 'i'))

# Only 7 EFL learners's data will be analysed
efl <- dplyr::filter(ppts, group == 'efl', Speaker %in% c('s1','s4','s5','s6','s7','s8','s9'))

# efl <- dplyr::filter(efl, Word != "sheep")
# efl <- dplyr::filter(efl, Word != "fish")

### ENGLISH VOWELS
### ENGLISH VOWELS
### ENGLISH VOWELS
### ENGLISH VOWELS
### ENGLISH VOWELS
### ENGLISH VOWELS

### preprocessing

# Filter: English vowels only
efl_En <- dplyr::filter(efl, Language == 'En')

# count and show New, Old input words
input_counts <- efl_En %>%
  count(Input)

old_words <- efl_En %>%
  filter(Input == "Old") %>%
  distinct(Word)

new_words <- efl_En %>%
  filter(Input == "New") %>%
  distinct(Word)

# how many fillers
ppts_fill <- filter(ppts, group == "efl", Language == "En")
ppts_fill %>%
  filter(phone %in% c("hs","u", "ct","as","er","rr","ab")) %>%
  distinct(Word)

# Treatment code Time, Input (reference level = New)
contrasts(efl_En$Input) <- contr.treatment(2)
contrasts(efl_En$Time) <- contr.treatment(2)

# Set the Time reference level to Time 2  
efl_En = efl_En %>% mutate(Time = relevel(Time, 'T2'))

# Set the intercept to /ae/  
efl_En = efl_En %>% mutate(Vowel = relevel(Vowel, 3))

# was any single word better than the other ones for ef vs ae
efl_En_means <- efl_En %>%
  filter(phone %in% c("ae")) %>%
  group_by(Word, Input) %>% # Group by Word. Replace 'Word' with 'group' if needed.
  summarize(
    Mean_F1_F0 = mean(F1e - F0e, na.rm = TRUE), # Calculate mean F1-F0
    Mean_F2_F0 = mean(F2e - F0e, na.rm = TRUE) # Calculate mean F2-F0
  )  %>%
  arrange(Mean_F1_F0)

write.xlsx(efl_En_means, file = "efl_En_means_sorted.xlsx")

# ENGLISH VOWELS: MODELS

### model height
### model height
### model height

# Build model
heighteflEn.mdl <- lmer(F1e-F0e ~ Vowel * Time *Input + (1|Speaker) + (1|Word),
                        data = efl_En,
                        control = lmerControl(optimizer = 'bobyqa'))

summary(heighteflEn.mdl)
print(heighteflEn.mdl, correlation=TRUE)

# Save height model coefficients into "coefs" folder as .xlsx 
heightEn <- tidy(heighteflEn.mdl)
openxlsx::write.xlsx(heightEn, "coefs/heightEn.xlsx")

# Get r^2, model residuals, display q-q norm, q-q line, histogram
r.squaredGLMM(heighteflEn.mdl)
res <- residuals(heighteflEn.mdl)
qqnorm(res)
qqline(res)
hist(res)

res_squared <- res^2  # Step 1: Square each residual
sum_res_squared <- sum(res_squared)  # Step 2: Sum all squared residuals
mean_squared <- sum_res_squared / length(res)  # Step 3: Divide sum by number of residuals
root_mean_squared <- sqrt(mean_squared)  # Step 4: Take square root

root_mean_squared  

# height model fitted plot
# black and white
hieflEnfit <- ggemmeans(heighteflEn.mdl, type = 'fixed',
                             terms = c('Input','Vowel', 'Time'), ci.lvl = 0.95)

hieflEnfit <- plot(hieflEnfit, colors = "bw") + ggtitle('Predicted values of Vowel height') 
ggsave('figs/hieflEnfit_bw.png', plot = hieflEnfit, width = 5, height = 3, units = 'in', dpi = 600)

# colours
hieflEnfit <- ggemmeans(heighteflEn.mdl, type = 'fixed',
                        terms = c('Input','Vowel', 'Time'), ci.lvl = 0.95)

hieflEnfit <- plot(hieflEnfit) + ggtitle('Predicted values of Vowel height') 
ggsave('figs/hieflEnfit.png', plot = hieflEnfit, width = 5, height = 3, units = 'in', dpi = 600)

### model retraction
### model retraction
### model retraction

retreflEn.mdl <- lmer(F2e-F0e ~ Vowel * Time * Input + (1|Speaker) + (1|Word),
                      data = efl_En, control = lmerControl(optimizer = 'bobyqa'))

summary(retreflEn.mdl)
retrEn <- tidy(retreflEn.mdl)
openxlsx::write.xlsx(retrEn, "coefs/retrEn.xlsx")

r.squaredGLMM(retreflEn.mdl)

# get model residuals, display q-q norm, q-q line, histogram
res <- residuals(retreflEn.mdl)
qqnorm(res)
qqline(res)
hist(res)

# fitted plot 
# black and white
retr.estim <- ggemmeans(retreflEn.mdl, type = 'fixed',
                        terms = c('Input', 'Vowel', 'Time'), ci.lvl = 0.95)

retrfit <- plot(retr.estim, colors = "bw") +
  ggtitle('Predicted values of Vowel retraction')

ggsave('figs/retrfit_bw.png', plot = retrfit, width = 4, height = 3, units = 'in',
       dpi = 600)

# colours
retr.estim <- ggemmeans(retreflEn.mdl, type = 'fixed',
                        terms = c('Input', 'Vowel', 'Time'), ci.lvl = 0.95)

retrfit <- plot(retr.estim) +
  ggtitle('Predicted values of Vowel retraction')

ggsave('figs/retrfit.png', plot = retrfit, width = 4, height = 3, units = 'in',
       dpi = 600)

### L1 DRIFT MODELS
### L1 DRIFT MODELS
### L1 DRIFT MODELS
### L1 DRIFT MODELS
### L1 DRIFT MODELS

# include only Czech data for the 7 learners, only short front vowels and iː.
dataCz <- dplyr::filter(ppts, Language == 'Cs', 
                        Speaker %in% c('s1','s4','s5','s6','s7','s8','s9'),
                        Vowel %in% c('a', 'e', 'i', 'iː'))

# /e/ as intercept
dataCz = dataCz %>% mutate(Vowel = relevel(Vowel, 7))

# treatment code Time (reference level = T1)
contrasts(dataCz$Time) <- contr.treatment(2)

# Time 1 as reference level
dataCz = dataCz %>% mutate(Time = relevel(Time, 'T1'))

# how many czech targets 
filtered_data <- ppts %>%
  filter(Language == "Cs",
         Vowel %in% c('e', 'a', 'iː', 'i'))

unique_words <- filtered_data %>%
  distinct(Word) %>%
  pull(Word)

print(unique_words)

unique_word_count <- filtered_data %>%
  distinct(Word) %>%
  nrow()

print(unique_word_count)


# how many fillers
other_vowels_data <- ppts %>%
  filter(phone %in% c('o', 'oo', 'u', 'uu'), Language == 'Cs')

# Count the number of unique words
unique_word_count <- other_vowels_data %>%
  distinct(Word) # %>%
  # nrow()

print(unique_word_count, n = 21) 

unique_word_count <- other_vowels_data %>%
  distinct(Word) %>%
  pull(Word)

# model height Cs
# model height Cs
# model height Cs

heightCz.mdl <- lmer(F1e-F0e ~ Vowel * Time + 
                       (1|Speaker)  + (1|Word),
                     data = dataCz,
                     control = lmerControl(optimizer = 'bobyqa'))

summary(heightCz.mdl)

heightCz <- tidy(heightCz.mdl)
openxlsx::write.xlsx(heightCz, "coefs/heightCz.xlsx")

# check model residuals: q-q norm, q-q line, histogram
r.squaredGLMM(heightCz.mdl)
?r.squaredGLMM
res <- residuals(heightCz.mdl)

# qqnorm(res)
# qqline(res)
# hist(res)

# fitted plot

heightCz.estim <- ggemmeans(heightCz.mdl, type = 'fixed',
                            terms = c('Vowel', 'Time'), ci.lvl = 0.95)

# black and white

hi_Cz_fit <- plot(heightCz.estim, colors = "bw") +
  ggtitle('Predicted values of L1 Vowel height at Time 1 and Time 2')

ggsave('figs/hi_Cz_fit_bw.png', plot = hi_Cz_fit, width = 6, height = 4, units = 'in',
       dpi = 800)

# colours

hi_Cz_fit <- plot(heightCz.estim) +
  ggtitle('Predicted values of L1 Vowel height at Time 1 and Time 2')

ggsave('figs/hi_Cz_fit.png', plot = hi_Cz_fit, width = 6, height = 4, units = 'in',
       dpi = 800)

### model retraction Cs
### model retraction Cs
### model retraction Cs

retrCz.mdl <- lmer(F2e-F0e ~ Vowel * Time + 
                     (1|Speaker)  + (1|Word),
                   data = dataCz,
                   control = lmerControl(optimizer = 'bobyqa'))

summary(retrCz.mdl)

retrCz <- tidy(retrCz.mdl)
openxlsx::write.xlsx(retrCz, "coefs/retrCz.xlsx")

# check model residuals: q-q norm, q-q line, histogram
r.squaredGLMM(retrCz.mdl)
res <- residuals(retrCz.mdl)
qqnorm(res)
qqline(res)
hist(res)

#fitted plot
retrCz.estim <- ggemmeans(retrCz.mdl, type = 'fixed',
                          terms = c('Vowel', 'Time'), ci.lvl = 0.95)

retr_Cz_fit <- plot(retrCz.estim) +
  ggtitle('Predicted values of L1 Vowel retraction at Time 1 and Time 2')

ggsave('figs/retr_Cz_fit.png', plot = retr_Cz_fit, width = 6, height = 4, units = 'in',
       dpi = 800)

#######################################################
### V PLOTS



# change symbols
cz_Vowels <- mutate(dataCz, Vowel = as.factor(ifelse(phone == "is", "i", 
                                                        ifelse(phone == "ii", "iː",
                                                               as.character(Vowel)))))


windowsFonts(CharisSIL=windowsFont("Charis SIL"))

# Czech Time 1 vs Time 2
view(dataCz)
with(dataCz, plotVowels(F1e-F0e, F2e-F0e, Vowel, group = Time,
                        plot.tokens = TRUE, plot.means = TRUE, 
                        pch.means = Vowel, cex.means = 3,
                         alpha.tokens = 0.3,
                        pch.tokens = Vowel, cex.tokens = 0.8,
                        var.col.by = Time, 
                        ellipse.line = FALSE,  ellipse.fill = TRUE, fill.opacity = 0.2,
                        xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                        legend.kwd = "bottomleft", #output = "png",
                        pretty = TRUE, main = "Czech Vowels produced by learners at T1 and T2"))

# for slides background: no ellipses
with(dataCz, plotVowels(F1e-F0e, F2e-F0e, Vowel, group = Time,
                        plot.tokens = TRUE, plot.means = F, 
                        pch.means = Vowel, cex.means = 3,
                        alpha.tokens = 0.3,
                        pch.tokens = Vowel, cex.tokens = 3,
                        var.col.by = Time, 
                        ellipse.line = F,  ellipse.fill = F, fill.opacity = 0.2,
                        xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                        # legend.kwd = "bottomleft", #output = "png",
                        # output = "png",
                        pretty = TRUE, main = "Czech Vowels produced by learners at T1 and T2"))

# English high Time 1 vs Time 2 no Input separation
efl_En_hi <- dplyr::filter(efl_En, Vowel %in% c("i", "ɪ"))
with(efl_En_hi, plotVowels(F1e-F0e, F2e-F0e, Word, group= Time,
                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                           cex.means = 2.5, var.col.by = Time, var.sty.by = Time,
                           #col = c("black", "green3"),
                           # var.sty.by = Time,
                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.05,
                           # xlim = c(22, 10), 
                           ylim = c(7.5, -2),
                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                           pch.tokens = Word, 
                           cex.tokens = 0.8, alpha.tokens = 0.3, 
                           #col = c("red2", "springgreen4", "royalblue3"),
                           legend.kwd = "bottomleft",
                           # output = "png",
                           pretty = TRUE, main = "English Vowels at T1 and T2"))

efl_En_lo_old <- dplyr::filter(efl_En, phone %in% c("ae", "ef", "vt"), Input == "Old")
efl_En_lo_new <- dplyr::filter(efl_En, phone %in% c("ae", "ef", "vt"), Input == "New")

nrow(efl_En)
nrow(efl_En_lo_new)
nrow(efl_En_lo_old)

with(efl_En_lo_old, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Vowel,
                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                           cex.means = 2.5, var.col.by = Vowel,# var.sty.by = Time,
                          # col = c("black", "green3"),
                           # var.sty.by = Time,
                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.05,
                           xlim = c(18, 10), 
                           ylim = c(12, 4),
                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                           pch.tokens = Vowel, 
                           cex.tokens = 0.8, alpha.tokens = 0.3, 
                           #col = c("red2", "springgreen4", "royalblue3"),
                           legend.kwd = "bottomleft",
                           # output = "png",
                           pretty = TRUE, main = "English Vowels: Old"))

with(efl_En_lo_new, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Vowel,
                               plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                               cex.means = 2.5, var.col.by = Vowel,# var.sty.by = Time,
                               # col = c("black", "green3"),
                               # var.sty.by = Time,
                               ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.05,
                               xlim = c(18, 10), 
                               ylim = c(12, 4),
                               xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                               pch.tokens = Vowel, 
                               cex.tokens = 0.8, alpha.tokens = 0.3, 
                               #col = c("red2", "springgreen4", "royalblue3"),
                               legend.kwd = "bottomleft",
                               # output = "png",
                               pretty = TRUE, main = "English Vowels: New"))


with(efl_En_lo, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Time,
                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                           cex.means = 2.5, var.col.by = Time, var.sty.by = Time,
                           col = c("black", "green3"),
                           # var.sty.by = Time,
                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.05,
                           xlim = c(18, 10), 
                           ylim = c(12, 4),
                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                           pch.tokens = Vowel, 
                           cex.tokens = 0.8, alpha.tokens = 0.3, 
                           #col = c("red2", "springgreen4", "royalblue3"),
                           legend.kwd = "bottomleft",
                           # output = "png",
                           pretty = TRUE, main = "English Vowels at T1 and T2"))

# slides background
with(efl_En_lo_old, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Vowel,
                               plot.tokens = TRUE, plot.means = F, pch.means = Vowel,
                               cex.means = 2.5, var.col.by = Vowel,# var.sty.by = Time,
                               # col = c("black", "green3"),
                               # var.sty.by = Time,
                               ellipse.line = F,  ellipse.fill = F, fill.opacity = 0.05,
                               xlim = c(18, 15), 
                               ylim = c(13, 7),
                               xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                               pch.tokens = Vowel, 
                               cex.tokens = 2.4, alpha.tokens = 0.3, 
                               #col = c("red2", "springgreen4", "royalblue3"),
                               # legend.kwd = "bottomleft",
                               # output = "png",
                               pretty = TRUE, main = "English Vowels: New"))

with(efl_En_lo_old, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Vowel,
                               plot.tokens = TRUE, plot.means = F, pch.means = Vowel,
                               cex.means = 2.5, var.col.by = Vowel,# var.sty.by = Time,
                               # col = c("black", "green3"),
                               # var.sty.by = Time,
                               ellipse.line = F,  ellipse.fill = F, fill.opacity = 0.05,
                               xlim = c(15, 8), 
                               ylim = c(9, 1),
                               xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                               pch.tokens = Vowel, 
                               cex.tokens = 2.4, alpha.tokens = 0.3, 
                               #col = c("red2", "springgreen4", "royalblue3"),
                               # legend.kwd = "bottomleft",
                               # output = "png",
                               pretty = TRUE, main = "English Vowels: New"))

    # # English high Time 1 yes Input separation
    # efl_En_T1 <- filter(efl_En, Vowel %in% c("i", "ɪ", "æ", "ɛ", "ʌ", Time == "T1"))
    # with(efl_En_T1, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Input, var.sty.by = Input,
    #                            plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
    #                            cex.means = 3, var.col.by = Input, 
    #                            # var.sty.by = Time,
    #                            ellipse.line = TRUE,  ellipse.fill = FALSE, fill.opacity = 0.05,
    #                            # xlim = c(22, 10), 
    #                            #ylim = c(10, 0.5),
    #                            xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
    #                            pch.tokens = Vowel, 
    #                            cex.tokens = 0.6, alpha.tokens = 0.2, 
    #                            col = c("black", "red2"),
    #                            legend.kwd = "bottomleft",
    #                            #output = "png",
    #                            pretty = TRUE, main = "L2 Vowels in New and Old Words at T1"))
    # 
    # # English high Time 2 yes Input separation
    # efl_En_T2 <- filter(efl_En, Language == "En", Time == "T2", phone %in% c("ic", "i", "ae", "ef", "vt"))
    # with(efl_En_T2, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Input, var.sty.by = Input,
    #                            plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
    #                            cex.means = 3, var.col.by = Input, 
    #                            # var.sty.by = Time,
    #                            ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.05,
    #                            xlim = c(20, 9.5), 
    #                            #ylim = c(10, 0.5),
    #                            xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
    #                            pch.tokens = Vowel, 
    #                            cex.tokens = 0.6, alpha.tokens = 0.2, 
    #                            col = c("red2", "springgreen4"),
    #                            legend.kwd = "bottomleft",
    #                            # output = "png",
    #                            pretty = TRUE, main = "L2 Vowels in New and Old Words at T2"))
    # 
    # efl_En_T1 <- filter(efl_En, Language == "En", Time == "T1", phone %in% c("ic", "i", "ae", "ef", "vt"))
    # with(efl_En_T1, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Input, var.sty.by = Input,
    #                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
    #                           cex.means = 3, var.col.by = Input, 
    #                           # var.sty.by = Time,
    #                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.05,
    #                           xlim = c(20, 10), 
    #                           ylim = c(12, -1),
    #                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
    #                           pch.tokens = Vowel, 
    #                           cex.tokens = 0.6, alpha.tokens = 0.2, 
    #                           col = c("red2", "springgreen4"),
    #                           legend.kwd = "bottomleft",
    #                           # output = "png",
    #                           pretty = TRUE, main = "L2 Vowels in New and Old Words at T1"))

# Time 2: L1 /i, i:/ vs L2 /i, ɪ/
cz_hi_2 <- dplyr::filter(cz_Vowels, Time == "T2", Vowel %in% c("iː","i"))
en_hi_2 <- dplyr::filter(efl_En, Language == "En", Time == "T2", Vowel %in% c("i", "ɪ"))
hi_2 <- rbind(cz_hi_2, en_hi_2)
with(hi_2, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Language, 
                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                           cex.means = 2.5, var.col.by = Language, var.sty.by = Language,
                           # var.sty.by = Time,
                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.02,
                           xlim = c(20, 13), 
                           ylim = c(6, -1),
                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                           pch.tokens = Vowel, 
                           cex.tokens = 0.6, alpha.tokens = 0.2, 
                           col = c("blue", "red2"),
                           legend.kwd = "bottomleft",
                           output = "png",
                           pretty = TRUE, main = "L1 and L2 Vowels at T2"))



# En low Old vs czech 1
cz_Vowels1 <- dplyr::filter(cz_Vowels, Time == "T1", Vowel %in% c("e","a"))
efl_En_Old_low <- dplyr::filter(efl_En, Input == "Old", Vowel %in% c("æ", "ɛ", "ʌ"))

Cs1_EnOld <- rbind(cz_Vowels1, efl_En_Old_low)

with(Cs1_EnOld, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Language,
                        plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                        cex.means = 2.5, var.col.by = Language, var.sty.by = Language,
                        ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.02,
                        xlim = c(18, 10), 
                        ylim = c(12, 4),
                        xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                        pch.tokens = Vowel, 
                        output = "png",
                        cex.tokens = .6, alpha.tokens = 0.2, 
                        col = c( "royalblue3", "red3"),
                        legend.kwd = "bottomleft",
                        pretty = TRUE, main = "L2 /ɛ, æ, ʌ/ in Old Words and L1 /e, a/ at T1"))

# En low New vs Czech 2
efl_En_low_New <- dplyr::filter(efl_En, Vowel %in% c("æ", "ɛ", "ʌ"), Input == "New")
cz_Vowels2 <- dplyr::filter(cz_Vowels, Time == "T2", Vowel %in% c("e","a"))

Cs2_EnNew <- rbind( cz_Vowels2, efl_En_low_New)

with(Cs2_EnNew, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Language,
                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                           cex.means = 2.5, var.col.by = Language,  var.sty.by = Language,
                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.02,
                           xlim = c(18, 10), 
                           ylim = c(12, 3),
                           output = "png",
                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                           pch.tokens = Vowel, 
                           cex.tokens = .6, alpha.tokens = 0.2, 
                           col = c("royalblue3", "red3"),
                           legend.kwd = "bottomleft",
                           pretty = TRUE, main = "L2 /ɛ, æ, ʌ/ in New Words and L1 /e, a/ at T2"))


# low Old (T2) vs New (T2)
En_low_NewT2 <- dplyr::filter(efl_En, Time == "T2", Input == "New", Vowel %in% c("æ", "ɛ", "ʌ"))
En_low_OldT2 <- dplyr::filter(efl_En, Time == "T2", Input == "Old", Vowel %in% c("æ", "ɛ", "ʌ"))
En_low <- rbind(En_low_NewT2, En_low_OldT2)
with(En_low, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Input,
                           plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                           cex.means = 2.5, var.col.by = Input, var.sty.by = Input,
                           ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.02,
                           xlim = c(18, 10), 
                           ylim = c(12, 3),
                           #output = "png",
                           xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                           pch.tokens = Vowel, 
                           cex.tokens = .6, alpha.tokens = 0.2, 
                           col = c("red3", "black"),
                           output = "png",
                           legend.kwd = "bottomleft",
                           pretty = TRUE, main = "L2 /ɛ, æ, ʌ/ in Old and New Words at T2"))

# with(En_low, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Input,
#                         plot.tokens = TRUE, plot.means = FALSE, pch.means = Vowel,
#                         cex.means = 3.5, var.col.by = Input, 
#                         ellipse.line = FALSE,  ellipse.fill = TRUE, fill.opacity = 0.02,
#                         xlim = c(18, 15), 
#                         ylim = c(12, 7),
#                         #output = "png",
#                         xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
#                         pch.tokens = Vowel, 
#                         cex.tokens = 2, alpha.tokens = 0.5, 
#                         col = c("red3", "black"),
#                         #output = "png",
#                         #legend.kwd = "bottomleft",
#                         pretty = TRUE, main = "L2 /ɛ, æ, ʌ/ in Old and New Words at T2"))



############################################################ not currently using the following
### ZOOMING IN
# czech T1/T2 to compare with En New Vs
cz_Vowels1 <- filter(cz_Vowels, Time == 'T1')
cz_Vowels2 <- filter(cz_Vowels, Time == 'T2')
en_Vowels_Old <- filter(ppts, group == 'efl', Speaker %in% c('s1','s4', 's5', 's6', 's7', 's8', 's9'), 
                    Language == 'En', Input == 'Old', Time == "T2")
en_Vowels_New <- filter(ppts, group == 'efl', Speaker %in% c('s1','s4', 's5', 's6', 's7', 's8', 's9'), 
                        Language == 'En', Input == 'New', Time == "T2")
en_Vowels_New1 <- filter(ppts, group == 'efl', Speaker %in% c('s1','s4', 's5', 's6', 's7', 's8', 's9'), 
                        Language == 'En', Input == 'New', Time == "T1")

cz1_Old <- rbind(cz_Vowels1, en_Vowels_Old)

cz2_New <- rbind(cz_Vowels2, en_Vowels_New)
cz1_New1 <- rbind(cz_Vowels1, en_Vowels_New1)

# plot Czech T2 over English
cz1_New_low <- filter(cz1_New1, Vowel %in% c("a",  "ɛ",  "æ","ʌ", "e"))
with(cz1_New_low, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Language,
                             plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                             cex.means = 3.5, var.col.by = Language, 
                             ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.03,
                             # xlim = c(17.5, 10.5), 
                             # ylim = c(11.5, 3.5),
                             xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                             pch.tokens = Vowel, 
                             # output = "png",
                             col = c("blue", "red2"),
                             cex.tokens = 0.8, alpha.tokens = 0.3, 
                             #col = c("red2", "springgreen4", "royalblue3"),
                             legend.kwd = "bottomleft",
                             pretty = TRUE, main = "T1: Vowels in New L2 Words and L1 Vowels"))


# plot Czech T2 over English
cz2_New_low <- filter(cz2_New, Vowel %in% c("a",  "ɛ",  "æ","ʌ", "e"))
with(cz2_New_low, plotVowels(F1e-F0e, F2e-F0e, Vowel, group= Language,
                            plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                            cex.means = 3.5, var.col.by = Language, 
                            ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.03,
                            # xlim = c(17.5, 10.5), 
                            # ylim = c(11.5, 3.5),
                            xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                            pch.tokens = Vowel, 
                            output = "png",
                            col = c("blue", "red2"),
                            cex.tokens = 0.8, alpha.tokens = 0.3, 
                            #col = c("red2", "springgreen4", "royalblue3"),
                            legend.kwd = "bottomleft",
                            pretty = TRUE, main = "T2: Vowels in New L2 Words and L1 Vowels"))


# teacher + monolinguals plot
ex <- read_excel("reference_teacher.xlsx")

ex <- mutate(ex,language = as.factor(language),
             time = as.factor(time),
             vowel = as.factor(ifelse(phone == "e", "ɛ", 
                                      ifelse(phone == "i",
                                             ifelse(language == "Cs","ɪ", "i"),
                                             as.character(vowel)))))

ex <- filter(ex, phone %in% c("ic", "i", "vt", "ae", "ef", "ii", "a","e"))

ex_en <- filter(ex, phone %in% c("ic", "i", "vt", "ae", "ef"), language == "En")


# ex_En_ef <- filter(ex, vowel == "ɛ", language == "En")
# 
# F1e <- mean(ex_En_ef$F1e)
# F0e <- mean(ex_En_ef$F0e)
# meanEfHeight <- F1e-F0e
# 
# count_ʌ <- sum(str_count(ex$vowel, "ʌ"))

efl_new <- filter(efl_En, Input == "New", Time == "T2")
efl_new_oldT1 <- filter(efl_En, Input == "Old", Time == "T1")

ex_en <- ex_en %>%
  mutate(Input = 0) %>%
  select(Speaker:Vowel, Input, everything())

ex_en <- ex_en %>% rename(Speaker = speaker, Vowel = vowel, Language = language, Time = time, Word = word)

ex_efl_new <- rbind(ex_en, efl_new)
ex_efl_old <- rbind(ex_en, efl_new_oldT1)

par(mfrow = c(1,2))
with(ex_efl_new, plotVowels(F1e-F0e, F2e-F0e, Vowel, group = group,
                    plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                    cex.means = 2, var.col.by = group, 
                    ellipse.line = FALSE, ellipse.fill = TRUE, fill.opacity = 0.1,
                    #xlim = c(18, 12), 
                    #ylim = c(9, 2),
                    xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                    pch.tokens = Vowel, 
                    cex.tokens = 0.5, alpha.tokens = 0.4,
                   # output = "png",
                    pretty = TRUE, main = "Vowels produced by teacher vs learners (T2, new)",
                   legend.kwd = "bottomleft"))

with(ex_efl_old, plotVowels(F1e-F0e, F2e-F0e, Vowel, group = group,
                            plot.tokens = TRUE, plot.means = TRUE, pch.means = Vowel,
                            cex.means = 2, var.col.by = group, 
                            ellipse.line = FALSE, ellipse.fill = TRUE, fill.opacity = 0.1,
                            #xlim = c(18, 12), 
                            #ylim = c(9, 2),
                            xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                            pch.tokens = Vowel, 
                            cex.tokens = 0.5, alpha.tokens = 0.4,
                            # output = "png",
                            pretty = TRUE, main = "Vowels produced by teacher vs learners (T1, old)",
                            legend.kwd = "bottomleft"))

heightEx.mdl <- lmer(F1e-F0e ~ vowel + (1|word),
                     data = ex,
                     control = lmerControl(optimizer = 'bobyqa'))

hiEx <- tidy(heightEx.mdl)
openxlsx::write.xlsx(hiEx, "coefs/hiEx.xlsx")


retrEx.mdl <- lmer(F2e-F0e ~ Vowel + (1|Word),
                     data = ex_en,
                     control = lmerControl(optimizer = 'bobyqa'))

retrEx <- tidy(retrEx.mdl)
openxlsx::write.xlsx(retrEx, "coefs/retrEx.xlsx")



levels(ex$vowel)
ex = ex %>% mutate(vowel = relevel(vowel, 5))
summary(heightEx.mdl)

retrEx.mdl <- lmer(F2e-F0e ~ vowel*language + (1|word),
                     data = ex,
                     control = lmerControl(optimizer = 'bobyqa'))

summary(retrEx.mdl)

#fitted plot
ex_hi <- ggemmeans(heightEx.mdl, type = 'fixed',
                        terms = c('vowel', 'language'), ci.lvl = 0.95)
ex_hi

hieflEnfit <- plot(hieflEnfit) + ggtitle('Predicted values of Vowel height')
ggsave('figs/hieflEnfit.png', plot = hieflEnfit, width = 5, height = 3, units = 'in', dpi = 600)


drift_ef <- filter(efl_En, Vowel == "ɛ", Time == "T2")
drift_e <- filter(dataCz, Vowel == "e")
drift_e <- drift_e %>%
  mutate(Input = as.character(Time))

drift_e_ef <- rbind(drift_e, drift_ef)

with(drift_e_ef, plotVowels(F1e-F0e, F2e-F0e, Vowel, group = Input,
                            plot.tokens = TRUE, plot.means = TRUE, 
                            pch.means = Vowel, cex.means = 2,
                            alpha.tokens = 0.4,
                            pch.tokens = Vowel, cex.tokens = 0.5,
                            var.col.by = Input,
                            xlim = c(19,12), ylim = c(10.5,3.5),
                            ellipse.line = TRUE,  ellipse.fill = TRUE, fill.opacity = 0.1,
                            xlab = "F2-F0 (in ERB)", ylab = "F1-F0 (in ERB)",
                            legend.kwd = "bottomleft", #output = "png",
                            pretty = TRUE, main = "L1 /e/ at T1 and T2 vs L2 /ɛ/ in Old and New words"))